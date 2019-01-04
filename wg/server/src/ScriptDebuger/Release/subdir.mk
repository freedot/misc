################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../DbgConfiger.cpp \
../DbgHelper.cpp \
../DbgServer.cpp \
../DynSMDbg.cpp \
../GameSys.cpp \
../Rdb.cpp \
../RemoteDebugger.cpp 

OBJS += \
./DbgConfiger.o \
./DbgHelper.o \
./DbgServer.o \
./DynSMDbg.o \
./GameSys.o \
./Rdb.o \
./RemoteDebugger.o 

CPP_DEPS += \
./DbgConfiger.d \
./DbgHelper.d \
./DbgServer.d \
./DynSMDbg.d \
./GameSys.d \
./Rdb.d \
./RemoteDebugger.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -DDLL_EXPORTS -I../../include -I../../include/tinyxml -I../../include/lua -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


