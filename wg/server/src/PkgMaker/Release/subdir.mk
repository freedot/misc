################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../FileSpec.cpp \
../FileWrap.cpp \
../PkgMaker.cpp \
../Regex.cpp \
../SearchFiles.cpp 

OBJS += \
./FileSpec.o \
./FileWrap.o \
./PkgMaker.o \
./Regex.o \
./SearchFiles.o 

CPP_DEPS += \
./FileSpec.d \
./FileWrap.d \
./PkgMaker.d \
./Regex.d \
./SearchFiles.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -I../../include -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


