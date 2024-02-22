﻿export default class Constants {

    public static NAME_REQUIRE: string = 'Nhập Tên';
    public static ERROR_NOT_IMPLMENTED: string = 'Abstract method has been called but is not implmented.';
    public static PERSISTANCE_MONGO: string = 'MONGO'; //If it is not Mongo it is REST
    public static PERSISTANCE_POSTGRES: string = "POSTGRES";
    public static PERSISTANCE_REST: string = "REST";
    public static PERSISTANCE_SYNC: string = "SYNC_SERVICE";
    public static API_KEY_REQUIRE: string = 'Nhập MÃ TRUY CẬP';
    public static APP_DUPLICATE: string = 'TÊN ỨNG DỤNG ĐÃ TỒN TẠI';
    public static CACHE_REDIS: string = 'REDIS';
    public static CACHE_BROWSER: string = 'BROWSER';
    public static METHOD_NOT_IMPLMENTED: string = 'This method has not been implmented.';
    static DB_TYPES = {
        MONGO: Constants.PERSISTANCE_MONGO,
        POSTGRES: Constants.PERSISTANCE_POSTGRES,
        REST: Constants.PERSISTANCE_REST,
        SYNC: Constants.PERSISTANCE_SYNC,
        NONE: 'NO PERSISTANCE'
    }
    static ACCESS_NAME = class {
        public static EXAMINATION: string = 'Khám bệnh';
        public static OPERATOR: string = 'Thao tác';
        public static APOINTEMENT_SCHEDULE: string = 'Lịch hẹn';
        public static RECEIVE: string = 'Tiếp nhận';
    }
    static ROLE = class {
        public static ROLE_REQUIRE: string = 'Tên quyền bắt buộc';
        public static ROLE_DUPLICATE: string = 'Tên quyền không được trùng';
        public static DATACCESS_REQUIRE: string = 'Tên quyền bắt buộc';
        public static DATACCESS_DUPLICATE: string = 'Tên quyền không được trùng';
    }
    static STAFFS = class {
        public static STAFF_FULLNAME_REQUIRE: string = 'Tên nhân viên bắt buộc';
        public static PASSWORD_REQUIRE: string = 'Mật khẩu là bắt buộc';
        public static PASSWORD_MINLENGTH: string = 'Min length of Password is %d characters.';
        public static PASSWORD_MINLENGTH_VALUE: number = 6;
        public static PASSWORD_MAXLENGTH: string = 'Max length of Password is %d characters.';
        public static PASSWORD_MAXLENGTH_VALUE: number = 200;
        public static NEWPASSWORD_SAME_WITH: string = 'New Password is same with Current Password.';
        public static CONFIRMPASSWORD_REQUIRE: string = 'Confirm Password is required.';
        public static CONFIRMPASSWORD_COMPARE: string = 'Password is not match.';
        public static TEL_DUPLICATE: string = 'Số điện thoại đã tồn tại.';
    }
    static ERROR_MONGO = class {
        public static DUPLICATE: number = 11000;
    }

    public static DATE_TIME = class {
        public static DATE_FORMAT: string = 'dd MM yy';
        public static DATE_SHORT_FORMAT: string = 'dd MMM yyyy'
        public static TIME_FORMAT: string = 'hh:mm a';
        public static LANGUAGE_CULTURE = 'en-us';
        public static DATE_WITH_DAY_ORDINAL_FORMAT = '%s, %s %s %d';
        public static DATE_LONG_FORMAT: string = 'yyyy/MM/dd hh:mm';
        public static FULL_DATE_FORMAT_WITH_TWO_LINE = '%s | %s/%s, %d';
    }

    static DAY_OF_WEEK = class {
        public static MONDAY: number = 1;
        public static TUESDAY: number = 2;
        public static WEDNESDAY: number = 3;
        public static THURSDAY: number = 4;
        public static FRIDAY: number = 5;
        public static SATURDAY: number = 6;
        public static SUNDAY: number = 0;
    }

    static VALIDATORDECORATOR = class {
        public static VALIDATOR_REQUIRED_NAME = 'required';
        public static VALIDATOR_INTEGER_NAME = 'integer';
        public static VALIDATOR_EMAIL_NAME = 'email';
        public static VALIDATOR_MOBILE_NAME = 'mobile';
        public static VALIDATOR_MIN_NAME = 'min';
        public static VALIDATOR_MIN_MAX_NAME = 'minMax';
        public static VALIDATOR_LESS_THAN_NUMBER_NAME = 'lessThanNumber'
        public static VALIDATOR_MIN_LESS_EQUAL_MAX_NAME = 'minLessEqualMax';
        public static VALIDATOR_MAX_GREATER_EQUAL_MIN_NAME = 'maxGreaterEqualMin';
        public static VALIDATOR_MIN_DATE = 'minDate';
        public static VALIDATOR_MIN_LENGTH_NAME = 'minLength';
        public static VALIDATOR_MIN_ARRAY_LENGTH_NAME = 'minArrayLength';
        public static VALIDATOR_MAX_NAME = 'max';
        public static VALIDATOR_MAX_LENGTH_NAME = 'maxLength';
        public static VALIDATOR_MAX_ARRAY_LENGTH_NAME = 'maxArrayLength';
        public static VALIDATOR_GREATER_THAN_NAME = 'greater';
        public static VALIDATOR_GREATER_THAN_OR_EQUAL_NAME = 'greaterOrEqual';
        public static VALIDATOR_LESS_THAN_NAME = 'less';
        public static VALIDATOR_LESS_THAN_OR_EQUAL_NAME = 'lessOrEqual';
        public static VALIDATOR_COMPARE_STRING = 'compare';
        public static VALIDATOR_COMPARE_NOT_SAME_STRING = 'compareNotSame';
        public static VALIDATOR_PHONE_NAME = 'phone';
        public static IGNORE_VALIDATION = 'ignore';
        public static REQUIRED_AT_LEAST_ONE_DAY_OF_WEEK = 'oneDayOfWeek';
        public static DAY_IN_WEEK: number = 6;
        public static PERIOD_OVERLAP_TIME = 'overlapTime';
        public static VALIDATOR_NUMERIC_VALUE = 'numeric';
        public static VALIDATOR_FLOAT_NAME = 'float';
        public static VALIDATOR_MIN_CURRENT_TIME = 'minCurrentTime';
        public static VALIDATOR_MIN_CURRENT_MINUTES = 'minCurrentMinutes';
        public static VALIDATOR_MAX_OR_EQUAL_NAME = 'maxOrEqual';
        public static VALIDATOR_MIN_OR_EQUAL_NAME = 'minOrEqual';
        public static VALIDATOR_MAX_MEAL_PERIODS_NAME = 'maxMealPeriods';
        public static VALIDATOR_DUPLICATE_MEAL_PERIODS_NAME = 'duplicateMealPeriodName';
    }
    
    static ZALO = class {
        public static APP_ID_REQUIRED: string = 'Nhập ID ứng dụng zalo';
        public static SECRET_KEY_REQUIRED: string = 'Nhập khóa bí mật';
        public static OA_ID_REQUIRED: string = 'Nhập OA ID';
    }
}