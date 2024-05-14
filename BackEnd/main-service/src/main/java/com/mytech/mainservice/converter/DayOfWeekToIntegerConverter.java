package com.mytech.mainservice.converter;

import com.mytech.mainservice.model.Role;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

import java.time.DayOfWeek;

public class DayOfWeekToIntegerConverter implements Converter<DayOfWeek, Integer> {


    @Override
    public Integer convert(MappingContext<DayOfWeek, Integer> context) {
        try {
            DayOfWeek source = context.getSource();
            return source.getValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("DayOfWeek is not valid");
        }
    }
}
