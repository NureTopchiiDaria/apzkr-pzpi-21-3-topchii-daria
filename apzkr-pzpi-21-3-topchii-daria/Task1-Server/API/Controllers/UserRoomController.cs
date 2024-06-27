using Core.Models;
using BLL.Abstractions.Interfaces.RoomInterfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoomController : ControllerBase
    {
        private readonly IUserRoomsService _userRoomsService;

        public UserRoomController(IUserRoomsService userRoomsService)
        {
            _userRoomsService = userRoomsService ?? throw new ArgumentNullException(nameof(userRoomsService));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUserRoom(UserRoomCreateModel userRoomCreate)
        {
            if (userRoomCreate == null)
            {
                return BadRequest("Invalid user room data.");
            }

            try
            {
                await _userRoomsService.AddUserToRoom(userRoomCreate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("admin/{roomId}")]
        public async Task<IActionResult> GetAdminByRoomId(Guid roomId)
        {
            var userRoom = await _userRoomsService.GetUserRoomByRoomId(roomId);
            if (userRoom == null)
            {
                return NotFound($"Admin for room with id {roomId} not found.");
            }
            return Ok(userRoom);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRooms(Guid userId)
        {
            var userRooms = await _userRoomsService.GetRoomsForUser(userId);
            if (userRooms == null)
            {
                return NotFound($"No rooms found for user with id {userId}.");
            }
            return Ok(userRooms);
        }
    }
}