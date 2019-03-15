using Osmos.Business.Admin.Models;
using Osmos.Business.Common;
using Osmos.Business.Common.Helpers;
using Osmos.Business.Common.Models;
using Osmos.Business.Data.Models.Entities;
using Osmos.Business.Identity.Data.Models;
using Osmos.ExecutionPipeline;
using Osmos.Identity.Data.Managers;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Osmos.Business.Admin.Controllers
{
    [Authorize]
    [RoutePrefix("api/athletes")]
    public class AthletesController : BaseController
    {

        [Route("")]
        public async Task<IHttpActionResult> CreateAthleteAsync(CreateAthleteVm createAthleteVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var createCoachPipeline = new Pipeline
            {
                Actions = new PipelineAction[] {
                PipelineCreateAthlete.CreateAction(),
                PipelineAddUserToAthleteRole.CreateAction(),
                PipelineCreateAthleteProfile.CreateAction(),
                }
            };

            createCoachPipeline.Environment.UpSert("identityDb", _identityDb);
            createCoachPipeline.Environment.UpSert("userManager", _userManager);
            createCoachPipeline.Environment.UpSert("entitiesDb", _entitiesDb);
            createCoachPipeline.Environment.UpSert("createAthleteVm", createAthleteVm);


            try
            {
                await createCoachPipeline.ExecuteAsync();
            }
            catch (PipelineException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

            return Ok();

        }

        [Route("")]
        public async Task<IHttpActionResult> GetAthletesAsync()
        {

            var role = await _identityDb.Roles.FirstOrDefaultAsync(r => r.Name == RoleNames.Athlete);
            if (role == null) return InternalServerError();

            var athletes = await _identityDb.Users
                                    .Where(u => u.Roles.Select(r => r.RoleId).Contains(role.Id))
                                    .Where(u => u.Active)
                                    .OrderBy(u => u.LastName)
                                    .Select(u => new {
                                        FirstName = u.FirstName,
                                        LastName = u.LastName,
                                        Id = u.Id,
                                    })
                                    .ToListAsync();
            return Ok(athletes);

        }

        [Route("addCoach")]
        public async Task<IHttpActionResult> AddCoachToAthleteAsync(CoachAthleteIds coachAthleteIds)
        {
            if (coachAthleteIds == null) return InternalServerError();

            var athleteProfile = await _entitiesDb.AthleteProfiles.FirstOrDefaultAsync(p => p.IdentityId == coachAthleteIds.AthleteId);
            if (athleteProfile == null) return InternalServerError();

            var coachProfile = await _entitiesDb.CoachProfiles.FirstOrDefaultAsync(p => p.IdentityId == coachAthleteIds.CoachId);
            if (coachProfile == null) return InternalServerError();

            var coachAthlete = new CoachAthlete {
                AthlethProfileId = athleteProfile.Id,
                CoachProfileId = coachProfile.Id
            };

            var alreadyInDb = await _entitiesDb.CoachAthlete.FirstOrDefaultAsync(u => u.AthlethProfileId == coachAthlete.AthlethProfileId && u.CoachProfileId == coachAthlete.CoachProfileId);
            if (alreadyInDb != null) return BadRequest("Already have this coach.");

            _entitiesDb.CoachAthlete.Add(coachAthlete);
            await _entitiesDb.SaveChangesAsync();


            return Ok();
        }

        [Route("removeCoach")]
        public async Task<IHttpActionResult> RemoveCoachFromAthleteAsync(CoachAthleteIds coachAthleteIds)
        {
            if (coachAthleteIds == null) return InternalServerError();

            var athleteProfile = await _entitiesDb.AthleteProfiles.FirstOrDefaultAsync(p => p.IdentityId == coachAthleteIds.AthleteId);
            if (athleteProfile == null) return InternalServerError();

            var coachProfile = await _entitiesDb.CoachProfiles.FirstOrDefaultAsync(p => p.IdentityId == coachAthleteIds.CoachId);
            if (coachProfile == null) return InternalServerError();

            var coachAthlete = await _entitiesDb.CoachAthlete.FirstOrDefaultAsync(u => u.AthlethProfileId == athleteProfile.Id && u.CoachProfileId == coachProfile.Id);

            _entitiesDb.CoachAthlete.Remove(coachAthlete);
            await _entitiesDb.SaveChangesAsync();

            return Ok();
        }

    }
}
