using Microsoft.AspNet.Identity.EntityFramework;
using Osmos.Business.Common;
using Osmos.Business.Data.Models.Entities;
using Osmos.Business.Identity.Data.Models;
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
    [RoutePrefix("api/users")]
    public class UsersController : BaseController
    {
        [Route("{userId}")]
        public async Task<IHttpActionResult> GetUserAsync(string userId)
        {
            var roles = await _identityDb.Roles.ToListAsync();
            if (!roles.Any()) return InternalServerError();

            var user = await _identityDb.Users.FirstOrDefaultAsync(u => u.Id == userId);

            var userRoleName = roles.FirstOrDefault(r => r.Id == user.Roles.FirstOrDefault().RoleId);


            if (userRoleName.Name == RoleNames.Coach) {
                var coachProfile = await _entitiesDb.CoachProfiles.FirstOrDefaultAsync(p => p.IdentityId == user.Id);

                var coachAthlete = await _entitiesDb.CoachAthlete.Where(u => u.CoachProfileId == coachProfile.Id).Select(u => u.AthlethProfileId).ToListAsync();

                var athletesProfiles = await _entitiesDb.AthleteProfiles.Where(u => coachAthlete.Contains(u.Id)).ToListAsync();

                var athletesIds = athletesProfiles.Select(c => c.IdentityId).ToList();

                var athletes = await _identityDb.Users.Where(u => athletesIds.Contains(u.Id)).Select(u => new {
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Id = u.Id,
                }).ToListAsync();

                var userVm = new
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Id = user.Id,
                    Email = user.Email,
                    Active = user.Active,
                    Members = athletes,
                    CreatedDate = coachProfile.CreatedDate,
                    Type = coachProfile.Type,
                    Age = coachProfile.Age,
                    Role = userRoleName.Name
                };

                return Ok(userVm);

            } else if (userRoleName.Name == RoleNames.Athlete) {
                var athleteProfile = await _entitiesDb.AthleteProfiles.FirstOrDefaultAsync(p => p.IdentityId == user.Id);

                var coachAthlete = await _entitiesDb.CoachAthlete.Where(u => u.AthlethProfileId == athleteProfile.Id).Select(u => u.CoachProfileId).ToListAsync();

                var coachesProfiles = await _entitiesDb.CoachProfiles.Where(u => coachAthlete.Contains(u.Id)).ToListAsync();

                var coachesIds = coachesProfiles.Select(c => c.IdentityId).ToList();

                var coaches = await _identityDb.Users.Where(u => coachesIds.Contains(u.Id)).Select(u => new {
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Id = u.Id,
                }).ToListAsync();

                var userVm = new
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Id = user.Id,
                    Email = user.Email,
                    Active = user.Active,
                    Members = coaches,
                    CreatedDate = athleteProfile.CreatedDate,
                    Type = athleteProfile.Type,
                    Age = athleteProfile.Age,
                    Role = userRoleName.Name,
                    Gender = athleteProfile.Gender.ToString()
                };

                return Ok(userVm);
            };






            return Ok();
        }

        [Route("")]
        public async Task<IHttpActionResult> GetUsersAsync()
        {
            var roles = await _identityDb.Roles.ToListAsync();
            if (!roles.Any()) return InternalServerError();

            var adminRole = roles.FirstOrDefault(r => r.Name == RoleNames.Administrator);
            if (adminRole == null) return InternalServerError();

            var users = await _identityDb.Users
                                    .Where(u => !u.Roles.Select(r => r.RoleId).Contains(adminRole.Id))
                                    .Where(u => u.Active)
                                    .OrderBy(u => u.LastName)
                                    .ToListAsync();

            var usersVm = users.Select(u => new UserVm {
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Active = u.Active,
                Id = u.Id,
                Role = u.Roles.FirstOrDefault() != null ? u.Roles.FirstOrDefault().RoleId : null
            }).ToList();

            foreach (var user in usersVm) {
                var role = roles.FirstOrDefault(r => r.Id == user.Role);
                var roleName = role != null ? roles.FirstOrDefault(r => r.Id == user.Role).Name : null;
                user.Role = roleName;
            };

            return Ok(usersVm);
        }

        [Route("{userId}")]
        public async Task<IHttpActionResult> DeleteUsersAsync(string userId)
        {

            var user = await _identityDb.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            user.Active = false;

            await _identityDb.SaveChangesAsync();

            return Ok();
        }

        public class UserVm {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Id { get; set; }
            public string Email { get; set; }
            public bool Active { get; set; }
            public string Role { get; set; }
        } 
    }
}
