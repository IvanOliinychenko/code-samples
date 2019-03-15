using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Osmos.Web.Data;
using Osmos.Web.Data.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Osmos.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/Partners")]
    public class PartnersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PartnersController(ApplicationDbContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Partners
        [HttpGet]
        public IEnumerable<Partner> GetPartners()
        {
            return _context.Partners.OrderBy(p => p.Name);
        }

        // GET: api/Partners/5
        [HttpGet("{name}")]
        public async Task<IActionResult> GetPartner(string name = null)
        {
            if (name == null) return NotFound();

            var partner = await _context.Partners.SingleOrDefaultAsync(m => m.Name == name);

            if (partner == null)
            {
                return NotFound();
            }

            return Ok(partner);
        }

        // PUT: api/Partners/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPartner([FromRoute] string id, [FromBody] PartnerVm partnerVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != partnerVm.Id)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(partnerVm.Image64))
            {
                _SaveLogo(partnerVm.Image64, partnerVm.Id);
            }

            var partner = partnerVm.ToBase();
            partner.UpdatedDate = DateTime.UtcNow;
            _context.Entry(partner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartnerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Partners
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostPartner([FromBody] PartnerVm partnerVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(partnerVm.Image64))
            {
                return BadRequest(new
                {
                    message = "Please set an image."
                });
            }

            _SaveLogo(partnerVm.Image64, partnerVm.Id);

            var partner = partnerVm.ToBase();
            _context.Partners.Add(partner);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPartner", new { id = partner.Id }, partner);
        }

        // DELETE: api/Partners/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePartner([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var partners = await _context.Partners.ToListAsync();

            var partner = partners.FirstOrDefault(p => p.Id == id);
            if (partner == null)
            {
                return NotFound();
            }

            string logosPath = Path.Combine(_hostingEnvironment.WebRootPath, "images/logos");

            if (!Directory.Exists(logosPath))
            {
                Directory.CreateDirectory(logosPath);
            }

            var directories = Directory.GetDirectories(logosPath);
            foreach (var directory in directories)
            {
                Directory.Delete(directory, true);
            }

            var filePathsToDelete = Directory.GetFiles(logosPath)
                .Where(f => !partners.Select(p => Path.GetFileName(Path.Combine(logosPath, p.Id.ToString() + ".png"))).Contains(Path.GetFileName(f)))
                .ToList();
            foreach (var filePath in filePathsToDelete)
            {
                System.IO.File.Delete(filePath);
            }

            System.IO.File.Delete(Path.Combine(logosPath, partner.Id.ToString() + ".png"));

            _context.Partners.Remove(partner);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool PartnerExists(string id)
        {
            return _context.Partners.Any(e => e.Id == id);
        }

        private readonly IHostingEnvironment _hostingEnvironment;

        private void _SaveLogo(string base64, string partnerId)
        {
            string logosPath = Path.Combine(_hostingEnvironment.WebRootPath, "images/logos");

            if (!Directory.Exists(logosPath))
            {
                Directory.CreateDirectory(logosPath);
            }

            string imgPath = Path.Combine(logosPath, partnerId.ToString() + ".png");
            if (System.IO.File.Exists(imgPath))
            {
                System.IO.File.Delete(imgPath);
            }

            byte[] imageBytes = Convert.FromBase64String(base64);

            System.IO.File.WriteAllBytes(imgPath, imageBytes);
        }
    }

    public class PartnerVm : Partner
    {
        public string Image64 { get; set; }

        public Partner ToBase()
        {
            var partner = new Partner
            {
                Id = Id,
                CreatedDate = CreatedDate,
                UpdatedDate = UpdatedDate,
                Content = Content,
                Name = Name
            };

            return partner;
        }
    }
}