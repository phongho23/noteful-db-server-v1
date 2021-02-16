module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/noteful',
    API_TOKEN: process.env.API_TOKEN
}

// frozen-plateau-54537
//https://frozen-plateau-54537.herokuapp.com/
//Created postgresql-opaque-12377 as DATABASE_URL
