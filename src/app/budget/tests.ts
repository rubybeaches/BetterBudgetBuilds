// Documenting cases that could become future test cases to integrate

// For Saving a Budget - calls to saveBudget async function =>
// Determines what method of budget creation to use
// We determine if a budget exists by checking default income, if not then simple create call
// // income default is 0 when budget does not exist, and we prevent creating a budget with 0 for income
// Our next check is whether to update or replace the current active budget
// // Elsewhere, we restrict overriding previous non-active budgets by disabling months before activeBudgetStart
// We check if the user selected month differs from the active start month
// To datermine to either set an end date for prior active budget and then create new active,
// // set end of n-1 of user selected month. This allows both past and future selected months to be updated correctly
// // works for future months too because it updates active budget start - which means all months before that would be disabled
// OR update/replace the current active budget if it starts in the same month the user selected
