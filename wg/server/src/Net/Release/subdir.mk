################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../DataProcessor.cpp \
../IpHelper.cpp \
../LinuxNetIO.cpp \
../Messager.cpp \
../NetIO.cpp \
../Socket.cpp \
../WinNetIO.cpp 

C_SRCS += \
../md5c.c 

OBJS += \
./DataProcessor.o \
./IpHelper.o \
./LinuxNetIO.o \
./Messager.o \
./NetIO.o \
./Socket.o \
./WinNetIO.o \
./md5c.o 

C_DEPS += \
./md5c.d 

CPP_DEPS += \
./DataProcessor.d \
./IpHelper.d \
./LinuxNetIO.d \
./Messager.d \
./NetIO.d \
./Socket.d \
./WinNetIO.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -I../../include -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '

%.o: ../%.c
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C Compiler'
	gcc -fPIC -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


