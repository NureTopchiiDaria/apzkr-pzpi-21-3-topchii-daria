﻿namespace Core.Models.UserModels
{
    public class UserEditModel
    {
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
    }
}
