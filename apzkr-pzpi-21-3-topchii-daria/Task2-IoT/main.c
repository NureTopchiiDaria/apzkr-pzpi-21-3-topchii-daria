#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>
#include <limits.h>

#define PULSE_MIN 60
#define PULSE_MAX 100
#define LAT_MIN -90.0
#define LAT_MAX 90.0
#define LON_MIN -180.0
#define LON_MAX 180.0

#define ARRAY_SIZE 6000

int pulse_values[ARRAY_SIZE];
double latitude_values[ARRAY_SIZE];
double longitude_values[ARRAY_SIZE];
int current_index = 0;
pthread_mutex_t lock;

void *generate_values(void *arg) {
    srand(time(NULL));
    while (1) {
        pthread_mutex_lock(&lock);
        pulse_values[current_index] = rand() % (PULSE_MAX - PULSE_MIN + 1) + PULSE_MIN;
        latitude_values[current_index] = LAT_MIN + (double)rand() / RAND_MAX * (LAT_MAX - LAT_MIN);
        longitude_values[current_index] = LON_MIN + (double)rand() / RAND_MAX * (LON_MAX - LON_MIN);
        current_index = (current_index + 1) % ARRAY_SIZE;
        pthread_mutex_unlock(&lock);
        usleep(10000); 
    }
    return NULL;
}

void *calculate_and_print_stats(void *arg) {
    while (1) {
        sleep(1); 

        pthread_mutex_lock(&lock);
        if (current_index > 0) {
            double avg_pulse = 0, avg_latitude = 0, avg_longitude = 0;
            int min_pulse = INT_MAX, max_pulse = INT_MIN;
            double min_latitude = 0, min_longitude = 0, max_latitude = 0, max_longitude = 0;

            for (int i = 0; i < current_index; ++i) {
                avg_pulse += pulse_values[i];
                avg_latitude += latitude_values[i];
                avg_longitude += longitude_values[i];

                if (pulse_values[i] < min_pulse) {
                    min_pulse = pulse_values[i];
                    min_latitude = latitude_values[i];
                    min_longitude = longitude_values[i];
                }
                if (pulse_values[i] > max_pulse) {
                    max_pulse = pulse_values[i];
                    max_latitude = latitude_values[i];
                    max_longitude = longitude_values[i];
                }
            }

            avg_pulse /= current_index;
            avg_latitude /= current_index;
            avg_longitude /= current_index;

            printf("Average pulse: %.2f, Average latitude: %.2f, Average longitude: %.2f\n", avg_pulse, avg_latitude, avg_longitude);
            printf("Minimum pulse: %d at coordinates (%.2f, %.2f)\n", min_pulse, min_latitude, min_longitude);
            printf("Maximum pulse: %d at coordinates (%.2f, %.2f)\n", max_pulse, max_latitude, max_longitude);
        }
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

void app_main() {
    pthread_t generator_thread, calculator_thread;

    pthread_mutex_init(&lock, NULL);

    pthread_create(&generator_thread, NULL, generate_values, NULL);
    pthread_create(&calculator_thread, NULL, calculate_and_print_stats, NULL);

    pthread_join(generator_thread, NULL);
    pthread_join(calculator_thread, NULL);

    pthread_mutex_destroy(&lock);
}
