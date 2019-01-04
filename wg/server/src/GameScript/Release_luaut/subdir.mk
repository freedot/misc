################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../DynSMWebSvr.cpp \
../DynSMWebSvr_LuaUT.cpp \
../tqAllTolua.cpp 

OBJS += \
./DynSMWebSvr.o \
./DynSMWebSvr_LuaUT.o \
./tqAllTolua.o 

CPP_DEPS += \
./DynSMWebSvr.d \
./DynSMWebSvr_LuaUT.d \
./tqAllTolua.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -DTOLUA_RELEASE -DDLL_EXPORTS -D__cplusplus -DLUA_UT -I../../include -I../../include/lua -I../../include/tinyxml -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


