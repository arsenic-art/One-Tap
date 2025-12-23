const { MAIN_SERVICES, ADDITIONAL_SERVICES } = require("../constants/servicesCatalog");

module.exports.calculatePrice = (selected, additional) => {
  let total = 0;

  for (const id of selected) {
    const service = MAIN_SERVICES.find(s => s.id === id);
    if (!service) throw new Error(`Invalid main service: ${id}`);
    total += service.price;
  }

  for (const id of additional) {
    const service = ADDITIONAL_SERVICES.find(s => s.id === id);
    if (!service) throw new Error(`Invalid additional service: ${id}`);
    total += service.price;
  }

  return total;
};
