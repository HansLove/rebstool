  export const calculateDaysUntilPayment = (qualificationDate: string | null) => {
    if (!qualificationDate) return "Pending";
    const qualification = new Date(qualificationDate);
    const paymentDate = new Date(
      qualification.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const today = new Date();
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : "Ready";
  };