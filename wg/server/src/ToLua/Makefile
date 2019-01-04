################################################################################
# Automatically-generated file. Do not edit!
################################################################################
RM := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include subdir.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

#System detection.
ifeq (Windows,$(findstring Windows,$(OS))$(MSYSTEM)$(TERM))
  HOST_SYS= Windows
  HOST_RM= rm
else
  HOST_SYS:= $(shell uname -s)
  ifneq (,$(findstring MINGW,$(HOST_SYS)))
    HOST_SYS= Windows
  endif
  ifneq (,$(findstring CYGWIN,$(HOST_SYS)))
    HOST_SYS= Windows
  endif
endif

IMPLIB := 
ifeq (Windows,$(HOST_SYS))
	IMPLIB=-Wl,--out-implib,libtolua.a
endif

# Add inputs and outputs from these tool invocations to the build variables 

# All Target
all: libtolua.so

# Tool invocations
libtolua.so: $(OBJS) $(USER_OBJS)
	@echo 'Building target: $@'
	@echo 'Invoking: GCC Archiver'
	g++ -L../lib -fPIC -shared -o "libtolua.so" $(OBJS) $(USER_OBJS) $(LIBS) $(IMPLIB)
	@echo 'Finished building target: $@'
	@echo ' '
	$(MAKE) --no-print-directory post-build

# Other Targets
clean:
	-$(RM) $(OBJS)$(C_DEPS)$(ARCHIVES) libtolua.so libtolua.a
	-@echo ' '

post-build:
	-python ./postbuild.py
	-@echo ' '

.PHONY: all clean dependents
.SECONDARY: post-build

