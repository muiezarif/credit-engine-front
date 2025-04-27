export const userDatabase = [
    {
      id: "USR001",
      govId: "GOV123456789",
      email: "john.doe@example.com",
      name: "John Doe",
      creditScore: 750,
      monthlyIncome: 85000,
      bankBalance: 125000,
      employmentStatus: "Permanent",
      employmentDuration: 48,
      existingLoans: [
        {
          type: "Car",
          amount: 300000,
          remainingAmount: 150000,
          paymentHistory: "Regular"
        }
      ],
      transactionHistory: {
        averageMonthlyBalance: 45000,
        bounceChecks: 0,
        regularSalaryCredits: true
      }
    },
    {
      id: "USR002",
      govId: "GOV987654321",
      email: "sarah.smith@example.com",
      name: "Sarah Smith",
      creditScore: 620,
      monthlyIncome: 35000,
      bankBalance: 28000,
      employmentStatus: "Contract",
      employmentDuration: 8,
      existingLoans: [
        {
          type: "Personal",
          amount: 200000,
          remainingAmount: 180000,
          paymentHistory: "Irregular"
        }
      ],
      transactionHistory: {
        averageMonthlyBalance: 15000,
        bounceChecks: 3,
        regularSalaryCredits: false
      }
    },
    {
      id: "USR003",
      govId: "GOV456789123",
      email: "mike.johnson@example.com",
      name: "Mike Johnson",
      creditScore: 680,
      monthlyIncome: 65000,
      bankBalance: 95000,
      employmentStatus: "Permanent",
      employmentDuration: 36,
      existingLoans: [
        {
          type: "Home",
          amount: 1500000,
          remainingAmount: 1200000,
          paymentHistory: "Regular"
        }
      ],
      transactionHistory: {
        averageMonthlyBalance: 35000,
        bounceChecks: 0,
        regularSalaryCredits: true
      }
    },
    {
      id: "USR004",
      govId: "GOV741852963",
      email: "emma.wilson@example.com",
      name: "Emma Wilson",
      creditScore: 550,
      monthlyIncome: 45000,
      bankBalance: 15000,
      employmentStatus: "Temporary",
      employmentDuration: 6,
      existingLoans: [
        {
          type: "Personal",
          amount: 150000,
          remainingAmount: 140000,
          paymentHistory: "Irregular"
        },
        {
          type: "Credit Card",
          amount: 50000,
          remainingAmount: 48000,
          paymentHistory: "Irregular"
        }
      ],
      transactionHistory: {
        averageMonthlyBalance: 12000,
        bounceChecks: 5,
        regularSalaryCredits: false
      }
    },
    {
      id: "USR005",
      govId: "GOV159753468",
      email: "david.brown@example.com",
      name: "David Brown",
      creditScore: 820,
      monthlyIncome: 95000,
      bankBalance: 250000,
      employmentStatus: "Permanent",
      employmentDuration: 60,
      existingLoans: [
        {
          type: "Home",
          amount: 2000000,
          remainingAmount: 1800000,
          paymentHistory: "Regular"
        }
      ],
      transactionHistory: {
        averageMonthlyBalance: 85000,
        bounceChecks: 0,
        regularSalaryCredits: true
      }
    }
  ];