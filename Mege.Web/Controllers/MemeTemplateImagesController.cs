using Microsoft.AspNetCore.Mvc;
using Mege.Core.Repositories;

namespace Mege.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemeTemplateImagesController : ControllerBase
{
    private readonly ILogger log;
    private readonly IMemeTemplateRepository repository;

    public MemeTemplateImagesController(
        IMemeTemplateRepository repository,
        ILogger<MemeTemplateImagesController> log)
    {
        this.repository = repository;
        this.log = log;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var memeTemplate = await repository.GetById(int.Parse(id));

        if (memeTemplate == null)
            return NotFound();

        return File(memeTemplate.Image, "image/jpeg");
    }
}
