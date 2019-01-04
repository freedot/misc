################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../encode/Base64.cpp \
../encode/SHA1.cpp 

OBJS += \
./encode/Base64.o \
./encode/SHA1.o 

CPP_DEPS += \
./encode/Base64.d \
./encode/SHA1.d 


# Each subdirectory must supply rules for building sources it contributes
encode/%.o: ../encode/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -DDEBUG -I../../include -I../../include/tinyxml -O0 -g3 -Wall -c -fmessage-length=0 -fPIC -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


