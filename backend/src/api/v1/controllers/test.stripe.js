const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY || "sk_test_51RWTv32NnaGUsgJk4a9dR7X5GPAWXUBG2j8dUZOesqR3YueJAGlRagnFlqxOCSacv2bVmtat6gW7MDlvI5s5UEFu005Ot5IwA4"
);

stripe.accounts.retrieve("acct_1ShKsERo6dsPxaq9")
    .then((result) => {
        console.log(result.capabilities);
    }).catch((err) => {
        console.log(err);
    });;



