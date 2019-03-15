<?php

require_once 'tests/common/DatabaseTestCase.php';
require_once "php/mysql_wrapper.php";
require_once "php/definitions.php";
require_once "php/utils.php";
require_once "php/utils__authentication.php";
require_once "core/Messenger.php";
require_once 'tests/common/MerchantContent.php';
require_once 'cron/staffScheduleReminder.php';
include_once 'internal_api/merchant.php';

class StaffScheduleReminderTest  extends DatabaseTestCase {
    const STAFF_ID = 1899;
        
    /** @var RequestContext $context **/
    protected $context;
     /** @var Staff $staff **/
    protected $staff;
     /** @var Merchant $staffMerchant **/
    protected $staffMerchant;
     /** @var DateTimeImmutable $now **/
    protected $now;
     /** @var DateTimeZone $staffMerchantTimezone **/
    protected $staffMerchantTimezone;
    
    public function setUp() {
        booxi_log_target('stdout');
        TaskQueueBatch::$disableTaskQueue = TRUE;
        
        parent::setUp();
        $this->context = RequestContext::get();

        $this->staff = $this->context->loadMerchantStaff(NULL, StaffScheduleReminderTest::STAFF_ID, LOAD_STAFF_DETAILS | LOAD_STAFF_SETTINGS, 500);
        $this->staffMerchant = $this->context->loadMerchant($this->staff->getMerchantId(), LOAD_MERCHANT_DETAILS | LOAD_MERCHANT_SCHEDULE, 500);
        $this->staffMerchantTimezone = new DateTimeZone($this->staffMerchant->getTimezone());
        $this->now = new DateTimeImmutable('NOW', new DateTimeZone($this->staffMerchant->getTimezone()));
        
        $this->setCommitOnPassedTest(false);
    }

    public function assertStaffReminder($expected, $now) {
        $this->assertEquals($expected, Staff::computeNextScheduleReminder($this->staff, $this->staffMerchant, new DateTimeImmutable($now, $this->staffMerchantTimezone))->setTimezone($this->staffMerchantTimezone)->format(DATETIME_FORMAT_FULL));
    }

    public function assertStaffReminderCalculated($delay = NULL) {


        $scheduleReminderDelay = $this->staff->getSettingByName('staff_schedule_reminder_delay')->getValue();

        if (!is_null($delay)) {
            $this->assertEquals($scheduleReminderDelay, $delay);
        }
        
        $nextScheduleReminder = Staff::computeNextScheduleReminder($this->staff, $this->staffMerchant, $this->now);
        $nextScheduleReminder->setTimezone(new DateTimeZone($this->staffMerchant->getTimezone()));
        $days = floor($scheduleReminderDelay / 1440);
        $minutes = $scheduleReminderDelay % 1440;
        $calculatedWorkDayStart = $nextScheduleReminder->modify(($days > 0 ? ' +' . $days . 'days': '') . ($minutes > 0 ? ' +' . $minutes . 'minute' : ''));
        $staffMerchantScheduleData = $this->staffMerchant->getSchedule()->getData();
        $dow = (int)$calculatedWorkDayStart->format('w');
        $expectedWorkDayStart = isset($staffMerchantScheduleData[$dow]) ? $staffMerchantScheduleData[$dow]->getStartTs() : STAFF_SCHEDULE_DEFAULT_REMINDER_TIME;
        $this->assertEquals($expectedWorkDayStart, $calculatedWorkDayStart->format("H:i"));
    }

    public function testUpdateStaffScheduleReminderDelay() {
        $overrideSettings = [
            'staff_schedule_reminder_delay' => [
                'enabled'   => TRUE,
                'value'     =>  60
            ]
        ];
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
        $this->assertStaffReminderCalculated(60);

        $data = [
            'settings_json' => json_encode([
                'staff_schedule_reminder_delay' => [
                    'enabled'   => TRUE,
                    'value'     =>  120
                ]
            ])
        ];
        $returnData = [];
        $this->staff->update($data, $returnData);
        $this->context->emptyCachedObjects();
        $this->staff = $this->context->loadMerchantStaff(NULL, StaffScheduleReminderTest::STAFF_ID, LOAD_STAFF_DETAILS | LOAD_STAFF_SETTINGS, 500);
        $this->assertStaffReminderCalculated(120);
    }

    public function testScheduleReminderDisabled() {
        $overrideSettings = [
            'staff_schedule_reminder' => [
                'enabled'   => TRUE,
                'value'     =>  STAFF_SCHEDULE_REMINDER_ENABLE_EMAIL
            ]
        ];
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
        $this->assertStaffReminderCalculated();

        $data = [
            'settings_json' => json_encode([
                'staff_schedule_reminder' => [
                    'enabled'   => FALSE,
                    'value'     =>  STAFF_SCHEDULE_REMINDER_DISABLED
                ]
            ])
        ];
        $returnData = [];

        $this->staff->update($data, $returnData);
        $this->context->emptyCachedObjects();
        $this->staff = $this->context->loadMerchantStaff(NULL, StaffScheduleReminderTest::STAFF_ID, LOAD_STAFF_DETAILS | LOAD_STAFF_SETTINGS, 500);
        $scheduleReminderTs = $this->staff->getScheduleReminder();
        $this->assertEquals(NULL, $scheduleReminderTs);
    }

    public function testScheduleReminderTsStaffDeleted() {
        $this->staff->delete();
        $this->context->emptyCachedObjects();
        $this->staff = $this->context->loadMerchantStaff(NULL, StaffScheduleReminderTest::STAFF_ID, LOAD_STAFF_DETAILS | LOAD_STAFF_SETTINGS, 500);
        $scheduleReminderTs = $this->staff->getScheduleReminder();       
        $this->assertEquals(NULL, $scheduleReminderTs);
    }

    public function testCalcNextScheduleReminderOpenHours() {
        $openHours = Schedule::buildMerchantOpenHours($this->staffMerchant->getId());
        $openHours->addWorkhour(0, "07:30", "16:00");
        // $openHours->addWorkhour(1, "09:00", "16:30");
        $openHours->addWorkhour(2, "11:20", "17:15");
        // $openHours->addWorkhour(3, "12:30", "19:20");
        $openHours->addWorkhour(4, "15:00", "20:50");
        // $openHours->addWorkhour(5, "19:30", "22:30");
        $openHours->addWorkhour(6, "22:00", "23:40");
       
        $content = new MerchantContent($this, $this->context, $this->staffMerchant->getId());
        $content->updateMerchantOpenHours($openHours);
        $this->context->emptyCachedObjects();
        $staffMerchant = $this->context->loadMerchant($this->staff->getMerchantId(), LOAD_MERCHANT_DETAILS | LOAD_MERCHANT_SCHEDULE, 500);
        
        $delay = 60;

        for ($i = 0; $i < 10; $i++) {
            $overrideSettings = [
                'staff_schedule_reminder_delay' => [
                    'enabled'   => true,
                    'value'     =>  $delay
                ]
            ];
            $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
            $scheduleReminderDelay = $this->staff->getSettingByName('staff_schedule_reminder_delay')->getValue();
            $this->assertEquals($delay, $scheduleReminderDelay);

            $nextScheduleReminder = Staff::computeNextScheduleReminder($this->staff, $staffMerchant, $this->now);
            $nextScheduleReminder->setTimezone(new DateTimeZone($staffMerchant->getTimezone()));
            $days = floor($scheduleReminderDelay / 1440);
            $minutes = $scheduleReminderDelay % 1440;
            $calculatedWorkDayStart = $nextScheduleReminder->modify(($days > 0 ? ' +' . $days . 'days': '') . ($minutes > 0 ? ' +' . $minutes . 'minute' : ''));
            $staffMerchantScheduleData = $staffMerchant->getSchedule()->getData();
            $dow = (int)$calculatedWorkDayStart->format('w');
            $expectedWorkDayStart = STAFF_SCHEDULE_DEFAULT_REMINDER_TIME;
            foreach ($staffMerchantScheduleData as $scheduleData) {
                if ($scheduleData->getWeekDay() == $dow) {
                    $expectedWorkDayStart = $scheduleData->getStartTs();
                    break;
                };
            }
            $this->assertEquals($expectedWorkDayStart, $calculatedWorkDayStart->format("H:i"));
            $delay *= 2;      
        } 
    }
    
    public function testCalcNextScheduleReminderSetting() {

        $delay = 60;

        for ($i = 0; $i < 10; $i++) {
           
            $overrideSettings = [
                'staff_schedule_reminder_delay' => [
                    'enabled'   => true,
                    'value'     =>  $delay
                ]
            ];

            $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
            $this->assertStaffReminderCalculated($delay);
            $delay *= 2;
        }
    }

    public function testCalcNextScheduleReminderDTCChange() {

        $data = [
            'wh_group_id' => 1253,
            'description' => '',
            'sched_type' => 0,
            'workhours' => [
                0 => [
                    'weekday' => 0,
                    'start_ts' => '10:00',
                    'end_ts' => '18:00'
                ]
            ],
            'merch_id' => $this->staff->getMerchantId(),
        ];

        $json_data = [];

        $state = merchantAPI::updateSchedule($this->staffMerchant, $data, $json_data);
        $this->context->emptyCachedObjects();
        $this->staffMerchant = $this->context->loadMerchant($this->staff->getMerchantId(), LOAD_MERCHANT_DETAILS | LOAD_MERCHANT_SCHEDULE, 500);

        // 8 hours
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode(['staff_schedule_reminder_delay' => ['enabled' => true, 'value' => 60 * 8]])));
        
        // DTC time change
        $this->assertStaffReminder('2019-03-10 03:00:00', '2019-03-10 00:00:00');

    }

    public function testCalcNextScheduleReminderMerchandOpenHoursChange() {

        $data = [
            'wh_group_id' => 1253,
            'description' => '',
            'sched_type' => 0,
            'workhours' => [
                0 => [
                    'weekday' => 0,
                    'start_ts' => '11:00',
                    'end_ts' => '18:00'
                ],
                1 => [
                    'weekday' => 1,
                    'start_ts' => '06:00',
                    'end_ts' => '18:00'
                ],
                2 => [
                    'weekday' => 2,
                    'start_ts' => '09:00',
                    'end_ts' => '18:00',
                ],
                3 => [
                    'weekday' => 3,
                    'start_ts' => '23:40',
                    'end_ts' => '23:50'
                ],
                4 => [
                    'weekday' => 4,
                    'start_ts' => '19:00',
                    'end_ts' => '21:00'
                ],
                5 => [
                    'weekday' => 5,
                    'start_ts' => '20:00',
                    'end_ts' => '21:00'
                ],
                6 => [
                    'weekday' => 6,
                    'start_ts' => '09:00',
                    'end_ts' => '11:00'
                ]
            ],
            'merch_id' => $this->staff->getMerchantId(),
        ];

        $json_data = [];

        $state = merchantAPI::updateSchedule($this->staffMerchant, $data, $json_data);
        $this->context->emptyCachedObjects();
        $this->staffMerchant = $this->context->loadMerchant($this->staff->getMerchantId(), LOAD_MERCHANT_DETAILS | LOAD_MERCHANT_SCHEDULE, 500);

        // 1 hour
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode(['staff_schedule_reminder_delay' => ['enabled' => true, 'value' => 60]])));

        $this->assertStaffReminder('2019-02-15 19:00:00', '2019-02-15 00:00:00');
        $this->assertStaffReminder('2019-02-15 19:00:00', '2019-02-15 07:00:00');
        $this->assertStaffReminder('2019-02-15 19:00:00', '2019-02-15 09:30:00');
        $this->assertStaffReminder('2019-02-15 19:00:00', '2019-02-15 12:30:00');
        $this->assertStaffReminder('2019-02-15 19:00:00', '2019-02-15 17:00:00');
        $this->assertStaffReminder('2019-02-16 08:00:00', '2019-02-15 20:00:00');
        $this->assertStaffReminder('2019-02-16 08:00:00', '2019-02-15 23:40:00');
        $this->assertStaffReminder('2019-02-16 08:00:00', '2019-02-15 23:59:59');

        $this->assertStaffReminder('2019-02-13 22:40:00', '2019-02-13 00:00:00');
        $this->assertStaffReminder('2019-02-13 22:40:00', '2019-02-13 07:00:00');
        $this->assertStaffReminder('2019-02-13 22:40:00', '2019-02-13 09:30:00');
        $this->assertStaffReminder('2019-02-13 22:40:00', '2019-02-13 12:30:00');
        $this->assertStaffReminder('2019-02-13 22:40:00', '2019-02-13 17:00:00');
        $this->assertStaffReminder('2019-02-14 18:00:00', '2019-02-13 23:40:00');
        $this->assertStaffReminder('2019-02-14 18:00:00', '2019-02-13 23:50:00');
        $this->assertStaffReminder('2019-02-14 18:00:00', '2019-02-13 23:59:59');

        // Send time equal to current time
        $this->assertStaffReminder('2019-02-02 08:00:00', '2019-02-01 19:00:00');
        $this->assertStaffReminder('2019-02-16 08:00:00', '2019-02-15 19:00:00');

        //begining of the year
        $this->assertStaffReminder('2019-01-01 08:00:00', '2019-01-01 00:00:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2019-01-01 07:00:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 09:30:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 12:30:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 17:00:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 23:40:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 23:50:00');
        $this->assertStaffReminder('2019-01-02 22:40:00', '2019-01-01 23:59:59');

        // end of the year
        $this->assertStaffReminder('2018-12-31 05:00:00', '2018-12-31 00:00:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 07:00:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 09:30:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 12:30:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 17:00:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 23:40:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 23:50:00');
        $this->assertStaffReminder('2019-01-01 08:00:00', '2018-12-31 23:59:59');

        // 8 hours
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode(['staff_schedule_reminder_delay' => ['enabled' => true, 'value' => 60 * 8]])));

        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 00:00:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 07:30:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 08:00:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 09:30:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 12:00:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 17:00:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 20:00:00');
        $this->assertStaffReminder('2019-02-12 01:00:00', '2019-02-11 23:59:59');

        // begining of the month
        $this->assertStaffReminder('2019-02-01 12:00:00', '2019-02-01 00:00:00');
        $this->assertStaffReminder('2019-02-01 12:00:00', '2019-02-01 07:30:00');
        $this->assertStaffReminder('2019-02-01 12:00:00', '2019-02-01 08:00:00');
        $this->assertStaffReminder('2019-02-01 12:00:00', '2019-02-01 09:30:00');
        $this->assertStaffReminder('2019-02-02 01:00:00', '2019-02-01 12:00:00');
        $this->assertStaffReminder('2019-02-02 01:00:00', '2019-02-01 17:00:00');
        $this->assertStaffReminder('2019-02-02 01:00:00', '2019-02-01 20:00:00');
        $this->assertStaffReminder('2019-02-02 01:00:00', '2019-02-01 23:59:59');

        // end of the month
        $this->assertStaffReminder('2019-02-28 11:00:00', '2019-02-28 00:00:00');
        $this->assertStaffReminder('2019-02-28 11:00:00', '2019-02-28 07:30:00');
        $this->assertStaffReminder('2019-02-28 11:00:00', '2019-02-28 08:00:00');
        $this->assertStaffReminder('2019-02-28 11:00:00', '2019-02-28 09:30:00');
        $this->assertStaffReminder('2019-03-01 12:00:00', '2019-02-28 12:00:00');
        $this->assertStaffReminder('2019-03-01 12:00:00', '2019-02-28 17:00:00');
        $this->assertStaffReminder('2019-03-01 12:00:00', '2019-02-28 20:00:00');
        $this->assertStaffReminder('2019-03-01 12:00:00', '2019-02-28 23:59:59');

        // Send time equal to current time
        $this->assertStaffReminder('2019-02-02 01:00:00', '2019-02-01 12:00:00');

        // 24 hours
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode(['staff_schedule_reminder_delay' => ['enabled' => true, 'value' => 60 * 24]])));
        
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 00:00:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 07:30:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 08:00:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 09:30:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 12:00:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 17:00:00');
        $this->assertStaffReminder('2019-02-12 23:40:00', '2019-02-12 20:00:00');
        $this->assertStaffReminder('2019-02-13 19:00:00', '2019-02-12 23:59:59');

        // 48 hours
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode(['staff_schedule_reminder_delay' => ['enabled' => true, 'value' => 60 * 48]])));

        $this->assertStaffReminder('2019-02-16 06:00:00', '2019-02-16 00:00:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 07:30:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 08:00:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 09:30:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 12:00:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 17:00:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 20:00:00');
        $this->assertStaffReminder('2019-02-17 09:00:00', '2019-02-16 23:59:59');
    }

    public function testCalcNextScheduleReminderTimezone() {

        $delay = 60 * 24 * 2;
        $timezones = [
            'Pacific/Midway',
            // 'Pacific/Honolulu',
            // 'US/Alaska',
            // 'America/Los_Angeles',
            'US/Mountain',
            'Canada/Saskatchewan',
            'America/Bogota',
            // 'America/Santiago',
            // 'America/Noronha',
            // 'Atlantic/Azores',
            'Africa/Casablanca',
            'UTC',
            'Europe/Amsterdam',
            // 'Europe/Athens',
            'Asia/Baghdad',
            // 'Asia/Muscat',
            // 'Asia/Karachi',
            // 'Asia/Almaty',
            // 'Asia/Bangkok',
            // 'Asia/Irkutsk',
            // 'Australia/Brisbane',
            // 'Asia/Vladivostok',
            // 'Pacific/Auckland',
            'Pacific/Tongatapu'
        ];

        foreach ($timezones as $timezone) {
           
            $overrideSettings = [
                'staff_schedule_reminder_delay' => [
                    'enabled'   => true,
                    'value'     =>  $delay
                ]
            ];
            $this->staffMerchant->setTimezone($timezone, true);
            
            $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
            $this->assertStaffReminderCalculated();
        }
    }

    public function testSendScheduleReminder() {

        $content = new MerchantContent($this, $this->context, $this->staffMerchant->getId());

        $client = $content->createClientWithEmail("Testus", "Testosteronius", "ivan+test@booxi.com");
        $serviceA = $content->createServiceForAppointment("Write Unit Test", Price::buildTypeFree(), 60);
        $serviceB = $content->createServiceForAppointment("Manual Testing", Price::buildTypeFree(), 120);
        
        $apptTimes = ['10:00', '12:00', '14:00', '16:00'];

        $appointments = [];
        $appointments[] = $content->createAppointmentFromStaff($this->staff->getId(), new DateTime("NOW {$apptTimes[0]}", new DateTimeZone($this->staffMerchant->getTimezone())), $client, $serviceA);
        $appointments[] = $content->createAppointmentFromStaff($this->staff->getId(), new DateTime("NOW {$apptTimes[1]}", new DateTimeZone($this->staffMerchant->getTimezone())), $client, $serviceB);
        $appointments[] = $content->createAppointmentFromStaff($this->staff->getId(), new DateTime("NOW {$apptTimes[2]}", new DateTimeZone($this->staffMerchant->getTimezone())), $client, $serviceA);
        $appointments[] = $content->createAppointmentFromStaff($this->staff->getId(), new DateTime("NOW {$apptTimes[0]}", new DateTimeZone($this->staffMerchant->getTimezone())), $client, $serviceB);

        $filter = AppointmentViewFilterById::MERCHANT_MULTIPLE((int)$this->staffMerchant->getId(), objects_get_method_unique($appointments, 'getId'));
        $appointmentViews = AppointmentView::loadAppointments($filter, new AppointmentViewLoadOptions());

        $result = sendStaffScheduleReminder($this->context, $this->staff, $this->staffMerchant, $this->staff->getEmail(), $this->staff->getLang(), new DateTime("NOW 00:00", new DateTimeZone($this->staffMerchant->getTimezone())));

        $this->assertEquals(SUCCESS, $result);

        $result = sendStaffScheduleReminder($this->context, $this->staff, $this->staffMerchant, $this->staff->getEmail(), $this->staff->getLang(), new DateTime("NOW 00:00 +1 year", new DateTimeZone($this->staffMerchant->getTimezone())));
        $this->assertEquals($result, SUCCESS);

        $overrideSettings = [
            'staff_schedule_reminder' => [
                'enabled'   => TRUE,
                'value'     =>  STAFF_SCHEDULE_REMINDER_ENABLE_EMAIL
            ]
        ];
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
        $this->staff->setEmail('');
        $result = sendStaffScheduleReminder($this->context, $this->staff, $this->staffMerchant, $this->staff->getEmail(), $this->staff->getLang(), new DateTime("NOW 00:00", new DateTimeZone($this->staffMerchant->getTimezone())));
        $this->assertEquals(SUCCESS, $result);

        $overrideSettings = [
            'staff_schedule_reminder' => [
                'enabled'   => TRUE,
                'value'     =>  STAFF_SCHEDULE_REMINDER_ENABLE_SMS
            ]
        ];
        $this->staff->setSettings(compute_settings(ACCT_STAFF, 'eng', json_encode($overrideSettings)));
        $this->staff->setMobile('');
        $result = sendStaffScheduleReminder($this->context, $this->staff, $this->staffMerchant, $this->staff->getEmail(), $this->staff->getLang(), new DateTime("NOW 00:00", new DateTimeZone($this->staffMerchant->getTimezone())));
        $this->assertEquals(SUCCESS, $result); 
    }
}