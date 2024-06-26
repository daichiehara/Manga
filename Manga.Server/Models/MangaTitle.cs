using System;
using System.Collections.Generic;

namespace Manga.Server.Models;

public partial class MangaTitle
{
    public int Id { get; set; }

    public string? MainTitle { get; set; }

    public string? YomiTitle { get; set; }

    public string? Author { get; set; }
}
