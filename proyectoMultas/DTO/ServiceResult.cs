public class ServiceResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public object? Data { get; set; }

    public ServiceResult(bool success, string message)
    {
        Success = success;
        Message = message;
        Data = null;
    }

    public ServiceResult(bool success, string message, object? data)
    {
        Success = success;
        Message = message;
        Data = data;
    }

    public static ServiceResult SuccessResult(string message, object? data = null)
        => new ServiceResult(true, message, data);

    public static ServiceResult FailureResult(string message)
        => new ServiceResult(false, message);
}
