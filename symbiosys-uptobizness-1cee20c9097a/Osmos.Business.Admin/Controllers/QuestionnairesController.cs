using Osmos.Blobs;
using Osmos.Business.Admin.Helpers;
using Osmos.Business.Common;
using Osmos.Business.Common.Helpers;
using Osmos.Business.Common.Models;
using Osmos.Files;
using System;
using System.Data.Entity;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Osmos.Business.Admin.Controllers
{
    [RoutePrefix("api/questionnaires")]
    public class QuestionnairesController : BaseController
    {
        [Route("")]
        public async Task<IHttpActionResult> GetQuestionnairesAsync()
        {
            int page = 1;
            int pageSize = 10;

            var pageHeader = Request.Headers.FirstOrDefault(a => a.Key == "os-page").Value;
            if (pageHeader != null)
            {
                int.TryParse(pageHeader.FirstOrDefault(), out page);
            }

            var pageSizeHeader = Request.Headers.FirstOrDefault(a => a.Key == "os-pagesize").Value;
            if (pageSizeHeader != null)
            {
                int.TryParse(pageSizeHeader.FirstOrDefault(), out pageSize);
            }

            var options = new GetEntitiesOptions<Questionnaire> {
                Page = page,
                PageSize = pageSize
            };

            var result = await _questionnairesRepository.GetEntitiesAsync(options);

            HttpContext.Current.Response.AppendHeader("os-page", page.ToString());
            HttpContext.Current.Response.AppendHeader("os-pagesize", pageSize.ToString());
            HttpContext.Current.Response.AppendHeader("os-total", result.Total.ToString());

            var entities = result.Entities.Select(q => new QuestionnaireVm(q)).ToArray();

            return Ok(entities);
        }

        [Route("{questionnaireId}")]
        public async Task<IHttpActionResult> GetQuestionnaireAsync(string questionnaireId) {

            var questionnaire = await _questionnairesRepository.GetEntityAsync(questionnaireId);

            if (questionnaire == null) return NotFound();

            return Ok(questionnaire);
        }

        [Route("")]
        public async Task<IHttpActionResult> CreateQuestionnaireAsync(Questionnaire questionnaire) {

            if (questionnaire == null) return BadRequest();

            var options = new GetEntitiesOptions<Questionnaire>
            {
                Predicate = a => a.Name == questionnaire.Name
            };

            var inDb = await _questionnairesRepository.GetEntitiesAsync(options);

            if (inDb.Total != 0) return BadRequest("Un questionnaire avec ce nom existe déjà.");

            await _questionnairesRepository.CreateEntityAsync(questionnaire);

            return Created(questionnaire.Id, questionnaire);
        }

        [Route("{questionnaireId}")]
        [HttpPatch]
        public async Task<IHttpActionResult> UpdateQuestionnaireAsync(string questionnaireId, Questionnaire questionnaire) {

            if (questionnaire == null || questionnaire.Id != questionnaireId) return BadRequest();

            questionnaire.UpdatedDate = DateTime.UtcNow;

            TagsHelper.SetTags(questionnaire);

            bool result = await _questionnairesRepository.UpdateEntityAsync(questionnaire);

            if (!result) return NotFound();

            return Ok(questionnaire);
        }

        [Route("{questionnaireId}")]
        public async Task<IHttpActionResult> DeleteQuestionnaireAsync(string questionnaireId) {

            bool result = await _questionnairesRepository.DeleteEntityAsync(questionnaireId);

            if (!result) return NotFound();

            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("answers/{answerId}")]
        public async Task<IHttpActionResult> DeleteQuestionnaireAnswerAsync(string answerId)
        {

            bool result = await _answersRepository.DeleteEntityAsync(answerId);

            if (!result) return NotFound();


            var documents = await _entitiesDb.FormDocuments.Where(b => b.FormId.ToString() == answerId).ToListAsync();

            if (documents.Count > 0)
            {
                _entitiesDb.FormDocuments.RemoveRange(documents);

                foreach (var document in documents)
                {
                    await BlobManager.DeleteFileAsync(document.Name);
                }

                await _entitiesDb.SaveChangesAsync();
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        //route changed from "answer to active"
        [Route("{questionnaireId}/active")]
        [HttpPatch]
        public async Task<IHttpActionResult> SetQuestionnaireActiveStateAsync(string questionnaireId, bool active)
        {
            var questionnaire = await _questionnairesRepository.GetEntityAsync(questionnaireId);
            if (questionnaire == null) return NotFound();

            questionnaire.Active = active;
            questionnaire.UpdatedDate = DateTime.UtcNow;

            await _questionnairesRepository.UpdateEntityAsync(questionnaire);

            return Ok(questionnaire);
        }

        [Route("{questionnaireId}/answers")]
        public async Task<IHttpActionResult> AnswerQuestionnaireAsync(string questionnaireId, QuestionnaireAnswers questionnaireAnswers)
        {
            if (questionnaireAnswers == null) return BadRequest();
            if (questionnaireAnswers.Questionnaire == null) return BadRequest();
            if (questionnaireAnswers.Questionnaire.Id.ToString() != questionnaireId) return BadRequest();


            var user = await _userManager.GetUserFromDbAsync(User);


            questionnaireAnswers.UserData = new UserData
            {
                Email = user.Email,
                FirstName = "admin",
                LastName = "",
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                CreatedDate = user.CreatedDate.DateTime
            };


            await _answersRepository.CreateEntityAsync(questionnaireAnswers);

            return Ok(questionnaireAnswers);
        }

        //route changed from "answer" to "answers" + userId in querystring + pagination
        [Route("{questionnaireId}/answers")]
        public async Task<IHttpActionResult> GetQuestionnaireAnswerAsync(string questionnaireId, string userId = null)
        {
            int? page = null;
            int? pageSize = null;

            var pageHeader = Request.Headers.FirstOrDefault(a => a.Key == "os-page").Value;
            if (pageHeader != null)
            {
                int.TryParse(pageHeader.FirstOrDefault(), out int iPage);
                page = iPage;
            }

            var pageSizeHeader = Request.Headers.FirstOrDefault(a => a.Key == "os-pagesize").Value;
            if (pageSizeHeader != null)
            {
                int.TryParse(pageSizeHeader.FirstOrDefault(), out int iPageSize);
                pageSize = iPageSize;
            }

            var options = new GetEntitiesOptions<QuestionnaireAnswers>
            {
                Predicate = a => true,
                Page = page,
                PageSize = pageSize
            };

            if (userId != null) options.Predicate = a => a.UserData.Id == userId;

            var result = await _answersRepository.GetEntitiesAsync(options);

            HttpContext.Current.Response.AppendHeader("os-page", page.ToString());
            HttpContext.Current.Response.AppendHeader("os-pagesize", pageSize.ToString());
            HttpContext.Current.Response.AppendHeader("os-total", result.Total.ToString());

            return Ok(result.Entities);
        }

        [Route("{questionnaireId}/report")]
        public async Task<IHttpActionResult> UploadReportAsync(Guid questionnaireId)
        {

            var user = await _userManager.GetUserFromDbAsync(User);
            if (user == null) return InternalServerError();

            var questionnaireResult = await _questionnairesRepository.GetEntityAsync(questionnaireId.ToString());

            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data/Files");
            string tmp = HttpContext.Current.Server.MapPath("~/App_Data/Temp");

            var provider = new MultipartFormDataStreamProvider(tmp);
            await Request.Content.ReadAsMultipartAsync(provider);

            try
            {
                foreach (var file in provider.FileData)
                {
                    if (file.GetFileExtension() != ".docx")
                    {
                        FileManager.DeleteTmpFiles(provider.FileData);
                        throw new Exception("Ce type de fichier n\'est pas autorisé. Seulement (.docx).");
                    }


                    var fileName = root + "/" + questionnaireResult.Name + ".docx";
                    File.Delete(fileName);

                    File.Move(file.LocalFileName, fileName);
                }
            }
            catch
            {
                FileManager.DeleteTmpFiles(provider.FileData);
                throw new Exception("Une erreur d\'envoi s\'est produite");
            }

            return Ok();
        }

        [Route("dataTypes")]
        public async Task<IHttpActionResult> GetDataTypesAsync()
        {
            return Ok(Enum.GetNames(typeof(ValueDataType)).ToList());
        }

        [Route("complexObjects")]
        public IHttpActionResult GetComplexObjects()
        {
            return Ok(ComplexObject.ComplexObjects);
        }

        //should be generated document by tag
        [Route("{formId}/generateDocument")]
        public async Task<HttpResponseMessage> GetQuestionnaireAnswersToCSVAsync(string formId, [FromUri]string export)
        {
            if (string.IsNullOrEmpty(formId) || string.IsNullOrEmpty(export)) return new HttpResponseMessage(HttpStatusCode.BadRequest);

            var result = await _answersRepository.GetEntityAsync(formId);
            if (result == null) return new HttpResponseMessage(HttpStatusCode.NotFound);

            bool hasData = false;

            MemoryStream memoryStream = new MemoryStream();
            StreamWriter writer = new StreamWriter(memoryStream, Encoding.UTF8);

            writer.Write(string.Format("Export,{0}{1}{2}", export, Environment.NewLine, Environment.NewLine));
            writer.Write(string.Format(",Valeur,Description,Tag{0}", Environment.NewLine));

            foreach (var section in result.Sections)
            {
                foreach (var answer in section.Answers)
                {
                    if (answer.Question == null || answer.Question.Exports == null || string.IsNullOrEmpty(answer.Question.Exports.FirstOrDefault(_ => _ == export))) continue;

                    hasData = true;

                    writer.Write(string.Format("Question,{0},{1},{2}{3}", answer.Question.Name, answer.Question.Description, answer.Question.Tag, Environment.NewLine));

                    if (answer.Choice != null)
                    {
                        writer.Write(string.Format("Réponse,{0},{1}{2}", answer.Choice.Name, answer.Choice.Description, Environment.NewLine));
                    };
                    if (answer.Choices != null)
                    {
                        foreach (var choice in answer.Choices)
                        {
                            writer.Write(string.Format("Réponse,{0},{1}{2}", choice.Name, choice.Description, Environment.NewLine));
                        }
                    }

                    //var lines = answer.Question.Lines;

                    //if (lines != null && lines.Any())
                    //{
                    //    foreach (var line in lines)
                    //    {
                    //        writer.Write(string.Format("Ligne:{0},{1},,{2}{3}", line.Title, line.Text, line.Tag, Environment.NewLine));
                    //    }
                    //}
                    //else 
                    if (!string.IsNullOrEmpty(answer.Text))
                    {
                        writer.Write(string.Format("Réponse,{0},,{1}", answer.Text, Environment.NewLine));
                        
                    }
                    writer.Write(string.Format("{0}", Environment.NewLine));
                }
            };

            writer.Flush();
            memoryStream.Position = 0;

            if (!hasData) return new HttpResponseMessage(HttpStatusCode.NotFound) {
                Content = new StringContent($"Pas de questions avec \"{export}\" trouvé.")
            };

            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(memoryStream)
            };

            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = $"{export.ToLower()}_{Stopwatch.GetTimestamp()}.csv"
            };

            return response;
        }

        #region internals

        private QuestionnairesRepository _questionnairesRepository = null;
        private AnswersRepository _answersRepository = null;
        private EnumsRepository _enumsRepository = null;

        public QuestionnairesController()
        {
            _questionnairesRepository = new QuestionnairesRepository();
            _answersRepository = new AnswersRepository();
            _enumsRepository = new EnumsRepository();
        }

        #endregion
    }
}
