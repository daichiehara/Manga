﻿using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Manga.Server
{
    public static class EnumNameExtentions
    {
        public static string GetDisplayName(this Enum enumValue)
        {
            var displayAttribute = enumValue.GetType()
                                            .GetMember(enumValue.ToString())
                                            .First()
                                            .GetCustomAttribute<DisplayAttribute>();

            return displayAttribute?.GetName() ?? enumValue.ToString();
        }
    }
}
