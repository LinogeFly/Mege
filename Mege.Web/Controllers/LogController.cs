using Microsoft.AspNetCore.Mvc;
using Mege.Models;

namespace Mege.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogController : ControllerBase
{
    private readonly ILogger log;

    public LogController(
        ILogger<LogController> log)
    {
        this.log = log;
    }

    [HttpPost]
    public IActionResult Log([FromBody] LogRequest logRequest)
    {
        foreach (var logEntry in logRequest.Logs)
        {
            Log(logEntry);
        }

        return Ok();
    }

    private void Log(LogEntry logEntry)
    {
        switch (logEntry.Level)
        {
            case Models.LogLevel.Trace:
                log.LogTrace(logEntry.Message);

                return;
            case Models.LogLevel.Warning:
                log.LogWarning(logEntry.Message);

                return;
            case Models.LogLevel.Error:
                log.LogError(logEntry.Message);

                return;
        }

        throw new InvalidOperationException($"Unknown log entry level '{logEntry.Level}'.");
    }
}
