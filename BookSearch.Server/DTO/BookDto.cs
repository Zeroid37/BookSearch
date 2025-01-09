namespace BookSearch.Server.DTO
{
    public class BookDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public string PublishYear { get; set; }
        public string Publisher { get; set; }
        public List<string> Genres { get; set; }
        public string Description { get; set; }
    }
}
