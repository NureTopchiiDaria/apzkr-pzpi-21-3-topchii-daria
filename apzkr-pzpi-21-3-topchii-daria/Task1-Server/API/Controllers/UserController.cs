using BLL.Abstractions.Interfaces.UserInterfaces;
using Core.DTOs;
using Core.Models.UserModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound($"User with id {id} not found.");
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreateModel userModel)
        {
            var result = await _userService.CreateNonActiveUser(userModel);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }
            return CreatedAtAction(nameof(GetUserById), new { id = result.Value.Id }, result.Value);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _userService.Delete(id);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }
            return NoContent();
        }

        [HttpPut("{id}/update-height")]
        public async Task<IActionResult> UpdateUserHeight(Guid id, [FromBody] UserHeightDTO userHeightDTO)
        {
            var userModel = new UserUpdateModel
            {
                Id = id,
                Height = userHeightDTO.Height,
            };

            var result = await _userService.Update(userModel, userHeightDTO);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }
            return Ok(result.Value);
        }

        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateUser(Guid id)
        {
            var result = await _userService.ActivateUser(id);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }
            return Ok(result.Value);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateModel userUpdate)
        {
            var result = await _userService.Update(userUpdate, null);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }
            return Ok(result.Value);
        }

        [HttpPost("{id}/upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(Guid id, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var result = await _userService.UpdateProfilePicture(id, memoryStream.ToArray());
            if (!result.IsSuccess)
            {
                return BadRequest(result.ExceptionMessage);
            }

            return Ok(result.Value);
        }
    }
}
