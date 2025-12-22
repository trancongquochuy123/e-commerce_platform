module.exports.priceNewProduct = (item) => {
    return (item.price - (item.price * item.discountPercentage) / 100).toFixed(2)
}

module.exports.getPriceNew = (price, discountPercentage) => {
    return (price - (price * discountPercentage) / 100).toFixed(2);
}