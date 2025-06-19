export function discountFields(lang: string): Record<string, any> {
  return {
    discountInfo: { $arrayElemAt: ["$matchedEvents", 0] },
    isDiscounted: { $gt: [{ $size: "$matchedEvents" }, 0] },
    discountPercentage: {
      $cond: [
        { $gt: [{ $size: "$matchedEvents" }, 0] },
        { $arrayElemAt: ["$matchedEvents.discountPercentage", 0] },
        0,
      ],
    },
    discountedPrice: {
      $cond: [
        { $gt: [{ $size: "$matchedEvents" }, 0] },
        {
          $round: [
            {
              $multiply: [
                "$price",
                {
                  $subtract: [
                    1,
                    {
                      $divide: [
                        {
                          $ifNull: [
                            {
                              $arrayElemAt: [
                                "$matchedEvents.discountPercentage",
                                0,
                              ],
                            },
                            0,
                          ],
                        },
                        100,
                      ],
                    },
                  ],
                },
              ],
            },
            0,
          ],
        },
        "$price",
      ],
    },
    name: { $ifNull: [`$name.${lang}`, "$name.en"] },
    slug: { $ifNull: [`$slug.${lang}`, "$slug.en"] },
    description: {
      $ifNull: [`$description.${lang}`, "$description.en"],
    },
  };
}

export function eventDiscountLookupStage(now: Date): Record<string, any> {
  return {
    $lookup: {
      from: "eventdiscounts",
      let: { productId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$isActive", true] },
                { $lte: ["$startDate", now] },
                { $gte: ["$endDate", now] },
                { $in: ["$$productId", "$products"] },
              ],
            },
          },
        },
        {
          $project: {
            name: 1,
            discountPercentage: 1,
            _id: 0,
          },
        },
      ],
      as: "matchedEvents",
    },
  };
}
