namespace Mege.Models;

public sealed class LogRequest
{
    public IEnumerable<LogEntry> Logs { get; set; } = new List<LogEntry>();
}

public sealed class LogEntry
{
    public string Message { get; init; } = "";

    public LogLevel Level { get; init; }
}

public enum LogLevel
{
    Trace,
    Warning,
    Error
}