using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Osmos.YouDil.Data.NoSql.Models.Entities;
using MongoDB.Bson;
using Osmos.YouDil.Data.NoSql.Models;

namespace Osmos.YouDil.Web.Controllers
{   
    [RoutePrefix("api/ads")]
    public class AdsController : ApiController
    {
        private MongoDbContext mongoDbContext = new MongoDbContext();

        [Route("")]
        public async Task<IHttpActionResult> GetAdsAsync([FromUri] AdFilters filter = null)
        {

            var result = await mongoDbContext.GetAdsAsync(filter);

            return Ok(result);
        }
        [Route("{id}")]
        public async Task<IHttpActionResult> GetAdAsync(string id)
        {

            var result = await mongoDbContext.GetAdAsync(id);

            return Ok(result);
        }
        [Route("")]
        [Authorize(Roles = "User")]
        public async Task<IHttpActionResult> CreateAdAsync(Ad ad)
        {
            var result = await mongoDbContext.AddAd(ad);

            return Created(ad._id.ToString(), ad);
        }
        [Route("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IHttpActionResult> UpdateAdAsync([FromUri] string id, UpdateAdData ad)
        {
            var result = await mongoDbContext.UpdateAdAsync(id, ad);

            return Created(id, ad);
        }

        [Route("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IHttpActionResult> DeleteAdAsync([FromUri] string id)
        {
            var result = await mongoDbContext.DeleteAdAsync(id);

            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("{id}")]
        [HttpPatch]
        [Authorize(Roles = "User")]
        public async Task<IHttpActionResult> PatchAdAsync([FromUri] string id, Ad ad)
        {
            var result = await mongoDbContext.PatchAdAsync(id, ad);

            return Ok(ad);
        }
    }
}
