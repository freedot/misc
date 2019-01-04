################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../DynSMCom.cpp \
../GameSys.cpp \
../LuaMath.cpp \
../LuaXml.cpp \
../RequireEx.cpp \
../tqAllTolua.cpp 

OBJS += \
./DynSMCom.o \
./GameSys.o \
./LuaMath.o \
./LuaXml.o \
./RequireEx.o \
./tqAllTolua.o 

CPP_DEPS += \
./DynSMCom.d \
./GameSys.d \
./LuaMath.d \
./LuaXml.d \
./RequireEx.d \
./tqAllTolua.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -DDLL_EXPORTS -DTOLUA_RELEASE -I../../include -I../../include/lua -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


