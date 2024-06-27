using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Abstractions.Interfaces;
using Core.DataClasses;
using Core.DTOs;
using Core.Models;
using DAL.Abstractions.Interfaces;
using NetTopologySuite.Geometries;

namespace BLL.Services
{
    public class TrackingDataService : ITrackingDataService
    {
        private readonly IGenericStorageWorker<TrackingDataModel> trackingDataStorage;

        public TrackingDataService(IGenericStorageWorker<TrackingDataModel> trackingDataStorage)
        {
            this.trackingDataStorage = trackingDataStorage;
        }

        public async Task<IEnumerable<TrackingDataModel>> GetTrackingDataByUserId(Guid userId)
        {
            var conditions = new Expression<Func<TrackingDataModel, bool>>[] { td => td.UserId == userId };
            return await this.trackingDataStorage.GetByConditions(conditions);
        }

        public async Task<LatestTrackingDataDto> GetLatestTrackingData(Guid userId, Guid roomId)
        {
            var conditions = new Expression<Func<TrackingDataModel, bool>>[]
            {
                td => td.UserId == userId && td.RoomId == roomId,
            };
            var trackingDataList = await this.trackingDataStorage.GetByConditions(conditions);

            var latestTrackingData = trackingDataList.OrderByDescending(td => td.Timestamp).FirstOrDefault();

            if (latestTrackingData == null)
            {
                return null;
            }

            return new LatestTrackingDataDto
            {
                Timestamp = latestTrackingData.Timestamp,
                Location = new LocationDto
                {
                    Latitude = latestTrackingData.Location.Y,
                    Longitude = latestTrackingData.Location.X,
                },
                Pulse = latestTrackingData.Pulse,
            };
        }

        public async Task<DistanceAndSpeedDto> GetTotalDistanceAndAverageSpeed(Guid userId, Guid roomId)
        {
            var conditions = new Expression<Func<TrackingDataModel, bool>>[]
            {
                td => td.UserId == userId && td.RoomId == roomId,
            };
            var trackingDataList = await this.trackingDataStorage.GetByConditions(conditions);

            if (trackingDataList == null || trackingDataList.Count() < 2)
            {
                return new DistanceAndSpeedDto
                {
                    TotalDistance = 0.0,
                    AverageSpeed = 0.0,
                };
            }

            double totalDistance = 0.0;
            var orderedTrackingDataList = trackingDataList.OrderBy(td => td.Timestamp).ToList();

            for (int i = 0; i < orderedTrackingDataList.Count - 1; i++)
            {
                var startPoint = orderedTrackingDataList[i].Location;
                var endPoint = orderedTrackingDataList[i + 1].Location;

                totalDistance += this.GetHaversineDistance(startPoint.X, startPoint.Y, endPoint.X, endPoint.Y);
            }

            var timeSpan = orderedTrackingDataList.Last().Timestamp - orderedTrackingDataList.First().Timestamp;
            double averageSpeed = totalDistance / timeSpan.TotalHours;

            return new DistanceAndSpeedDto
            {
                TotalDistance = totalDistance,
                AverageSpeed = averageSpeed,
            };
        }

        public async Task<TrackingDataModel> AddTrackingData(TrackingDataModel trackingData)
        {
            await this.trackingDataStorage.Create(trackingData);
            return trackingData;
        }

        public async Task<OptionalResult<TrackingDataModel>> UpdateTrackingData(TrackingDataModel trackingData)
        {
            if (await this.trackingDataStorage.GetById(trackingData.Id) is null)
            {
                return new OptionalResult<TrackingDataModel>(false, $"Tracking data with id {trackingData.Id} does not exist");
            }

            await this.trackingDataStorage.Update(trackingData);
            return new OptionalResult<TrackingDataModel>(trackingData);
        }

        public async Task<ExceptionalResult> DeleteTrackingData(Guid id)
        {
            var trackingData = await this.trackingDataStorage.GetById(id);
            if (trackingData is null)
            {
                return new ExceptionalResult(false, $"Tracking data with id {id} does not exist");
            }

            await this.trackingDataStorage.Delete(trackingData);
            return new ExceptionalResult();
        }

        public async Task<StatisticsDto> GetStatistics(Guid userId, Guid roomId)
        {
            var conditions = new Expression<Func<TrackingDataModel, bool>>[]
            {
                td => td.UserId == userId && td.RoomId == roomId,
            };
            var trackingDataList = await this.trackingDataStorage.GetByConditions(conditions);

            if (trackingDataList == null || !trackingDataList.Any())
            {
                return new StatisticsDto
                {
                    AveragePulse = 0.0,
                    Locations = new List<LocationDto>(),
                };
            }

            double averagePulse = trackingDataList.Average(td => td.Pulse);
            var locations = trackingDataList.Select(td => new LocationDto
            {
                Timestamp = td.Timestamp,
                Latitude = td.Location.Y,
                Longitude = td.Location.X,
            }).ToList();

            return new StatisticsDto
            {
                AveragePulse = averagePulse,
                Locations = locations,
            };
        }

#pragma warning disable CA1704
        private double GetHaversineDistance(double lon1, double lat1, double lon2, double lat2)
#pragma warning restore CA1704
        {
            const double R = 6371.0;
            double dLat = this.ToRadians(lat2 - lat1);
            double dLon = this.ToRadians(lon2 - lon1);

            double a = (Math.Sin(dLat / 2) * Math.Sin(dLat / 2)) +
                       (Math.Cos(this.ToRadians(lat1)) * Math.Cos(this.ToRadians(lat2)) *
                        Math.Sin(dLon / 2) * Math.Sin(dLon / 2));
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ToRadians(double angle)
        {
            return angle * (Math.PI / 180.0);
        }
    }
}
