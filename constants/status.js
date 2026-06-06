const TOUR_STATUS = Object.freeze({
  ACTIVE: "Active",
  INACTIVE: "Inactive",
});

const PACKAGE_STATUS = Object.freeze({
  ACTIVE: "Active",
  INACTIVE: "Inactive",
});

const INQUIRY_STATUS = Object.freeze({
  NEW: "New Inquiry",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
});

const INQUIRY_TIMELINE_REMARKS = Object.freeze({
  CUSTOMER_SUBMITTED_INQUIRY: "Customer submitted inquiry",
});

module.exports = {
  TOUR_STATUS,
  PACKAGE_STATUS,
  INQUIRY_STATUS,
  INQUIRY_TIMELINE_REMARKS,
};
