namespace Backend.DTOs.Common
{
    public class PagedResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "Data retrieved successfully";
        public List<T> Data { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasPrevious => Page > 1;
        public bool HasNext => Page < TotalPages;

        public static PagedResponse<T> Create(List<T> data, int page, int pageSize, int totalCount)
        {
            return new PagedResponse<T>
            {
                Data = data,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
    }
}
