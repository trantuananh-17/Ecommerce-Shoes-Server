import { ICreateEventResponseDto } from "./event.dto";
import { EventDiscount } from "./event.model";

export const eventResponseMapper = (
  event: EventDiscount
): ICreateEventResponseDto => {
  return {
    id: event._id.toString(),
    name: event.name,
    discountPercentage: event.discountPercentage,
    startDate: event.startDate,
    endDate: event.endDate,
    products: event.products.map((product) => product.toString()),
    isActive: event.isActive,
  };
};
