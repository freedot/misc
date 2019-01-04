################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../Connect.cpp \
../ConnectHandler.cpp \
../FlashHandler.cpp \
../GameSvrMessager.cpp \
../TGWHandler.cpp \
../User.cpp \
../WebSocketHandler.cpp 

OBJS += \
./Connect.o \
./ConnectHandler.o \
./FlashHandler.o \
./GameSvrMessager.o \
./TGWHandler.o \
./User.o \
./WebSocketHandler.o 

CPP_DEPS += \
./Connect.d \
./ConnectHandler.d \
./FlashHandler.d \
./GameSvrMessager.d \
./TGWHandler.d \
./User.d \
./WebSocketHandler.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -I../../include -I../../include/tinyxml -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


