using Osmos.YouDil.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Osmos.YouDil.Api.Controllers
{
    public abstract class BaseController : ApiController
    {
        public BaseController()
        {
            _dbContext = new ApplicationDbContext();
            _userManager = ApplicationUserManager.Create(_dbContext);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            if (disposing && _dbContext != null)
            {
                _dbContext.Dispose();
                _dbContext = null;
            }

            base.Dispose(disposing);
        }

        protected ApplicationDbContext _dbContext = null;
        protected ApplicationUserManager _userManager = null;
    }
}
