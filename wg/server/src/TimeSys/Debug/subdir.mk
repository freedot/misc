################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../TimeSys.cpp \
../TimerQueue.cpp \
../TimerQueueEx.cpp 

OBJS += \
./TimeSys.o \
./TimerQueue.o \
./TimerQueueEx.o 

CPP_DEPS += \
./TimeSys.d \
./TimerQueue.d \
./TimerQueueEx.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -DDEBUG -DDLL_EXPORTS -I../../include -O0 -g3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


