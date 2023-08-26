// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputAdornment,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const ExpenseManager = () => {
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [expenseName, setExpenseName] = useState(
//     selectedExpense ? selectedExpense.name : ""
//   );
//   const [expenseAmount, setExpenseAmount] = useState(
//     selectedExpense ? selectedExpense.amount : ""
//   );
//   const [expenseCategory, setExpenseCategory] = useState(
//     selectedExpense ? selectedExpense.category : ""
//   );
//   const [description, setDescription] = useState(
//     selectedExpense ? selectedExpense.description : ""
//   );
//   const [expenseDate, setExpenseDate] = useState(
//     new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000)
//   );
//   const [userLocale, setUserLocale] = useState("AED");
//   const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
//   const [expenses, setExpenses] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [searchText, setSearchText] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [fetchedExpenses, setFetchedExpenses] = useState([]);

//   const filteredExpenses = fetchedExpenses
//     .filter((expense) => {
//       if (selectedFilter === "all") {
//         return true;
//       } else {
//         const expenseMonth = new Date(expense.date).getMonth();
//         return expenseMonth === selectedFilter;
//       }
//     })
//     .filter((expense) => {
//       const lowerCaseSearchText = searchText.toLowerCase();
//       return (
//         expense.name.toLowerCase().includes(lowerCaseSearchText) ||
//         expense.description.toLowerCase().includes(lowerCaseSearchText)
//       );
//     })
//     .filter((expense) => {
//       if (categoryFilter === "all") {
//         return true; // Show all categories
//       } else {
//         return expense.category === categoryFilter;
//       }
//     });

//   const handleOpenAddDialog = () => {
//     setOpenAddDialog(true);
//   };

//   const handleCloseAddDialog = () => {
//     setOpenAddDialog(false);
//   };

//   const handleOpenEditDialog = (expense) => {
//     console.log("expense", expense);
//     setSelectedExpense(expense);
//     setExpenseName(expense.name);
//     setExpenseAmount(expense.amount);
//     setExpenseCategory(expense.category);
//     setDescription(expense.description);
//     setExpenseDate(new Date(expense.date));
//     setOpenEditDialog(true);
//   };

//   const handleCloseEditDialog = () => {
//     setSelectedExpense(null);
//     setExpenseName("");
//     setExpenseAmount("");
//     setOpenEditDialog(false);
//   };

//   const handleAddExpense = async () => {
//     const newExpense = {
//       name: expenseName,
//       amount: expenseAmount,
//       description: description,
//       category: expenseCategory,
//       date: expenseDate.toISOString(),
//     };
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("access_token");
//     console.log("userId", userId, newExpense);
//     try {
//       const response = await axios.post(
//         `http://localhost:8002/api/v1/add-expenses/${userId}`,
//         newExpense,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const addedExpense = response.data.data;
//       toast.success("Expense added successfully!");
//       const updatedExpenses = [...fetchedExpenses, addedExpense];
//       setFetchedExpenses(updatedExpenses);
//       handleCloseAddDialog();
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       toast.error("Error adding expense. Please try again.");
//     }
//   };

//   const handleEditExpense = async () => {
//     const updatedExpense = {
//       name: expenseName,
//       amount: expenseAmount,
//       description: description,
//       category: expenseCategory,
//       date: expenseDate.toISOString(),
//     };
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("access_token");
//     const expenseId = selectedExpense._id;
//     console.log("DATA", updatedExpense, userId, token, expenseId);
//     try {
//       await axios.put(
//         `http://localhost:8002/api/v1/expenses/${expenseId}/${userId}`,
//         updatedExpense,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedExpenses = fetchedExpenses.map((expense) =>
//         expense._id === expenseId ? { ...expense, ...updatedExpense } : expense
//       );

//       setFetchedExpenses(updatedExpenses);
//       toast.success("Expense updated successfully!");
//       handleCloseEditDialog();
//     } catch (error) {
//       console.error("Error updating expense:", error);
//       toast.error("Error updating expense. Please try again.");
//     }
//   };

//   const handleDeleteExpense = async (expenseId) => {
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("access_token");

//     try {
//       console.log("delete id", expenseId);
//       const res = await axios.delete(
//         `http://localhost:8002/api/v1/expenses/${expenseId}/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedExpenses = fetchedExpenses.filter(
//         (expense) => expense._id !== expenseId
//       );
//       toast.success("Expense deleted successfully!");
//       setFetchedExpenses(updatedExpenses);
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast.error("Error deleting expense. Please try again.");
//     }
//   };

//   const getCurrencySymbol = (currency) => {
//     return new Intl.NumberFormat(userLocale, {
//       style: "currency",
//       currency: currency,
//     }).formatToParts(1)[0].value;
//   };

//   const handleAmount = (event) => {
//     const inputPrice = event.target.value;
//     setExpenseAmount(inputPrice);
//   };

//   const handleCategoryChange = (event) => {
//     setExpenseCategory(event.target.value);
//   };

//   const handleDateChange = (event) => {
//     const selectedDate = new Date(event.target.value);
//     setExpenseDate(selectedDate);
//   };

//   const fetchExpenses = async () => {
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await axios.get(
//         `http://localhost:8002/api/v1/expenses/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const fetchedExpenses = response.data.expenses;
//       //   console.log("Response from fetched expnses",res)
//       setFetchedExpenses(fetchedExpenses);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   return (
//     <>
//       <Box bgcolor={"#e8f1ff"}>
//         <Container maxWidth="md">
//           <Typography variant="h4" align="center" gutterBottom>
//             Expense Manager
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleOpenAddDialog}
//             sx={{ marginTop: "30px", marginBottom: "20px" }}
//           >
//             Add Expense
//           </Button>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "20px",
//               gap: 10,
//             }}
//           >
//             <FormControl fullWidth variant="outlined" margin="normal">
//               <InputLabel>Filter by Month</InputLabel>
//               <Select
//                 value={selectedFilter}
//                 onChange={(e) => setSelectedFilter(e.target.value)}
//                 label="Filter by Month"
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 <MenuItem value={0}>January</MenuItem>
//                 <MenuItem value={1}>February</MenuItem>
//                 <MenuItem value={2}>March</MenuItem>
//                 <MenuItem value={3}>April</MenuItem>
//                 <MenuItem value={4}>May</MenuItem>
//                 <MenuItem value={5}>June</MenuItem>
//                 <MenuItem value={6}>July</MenuItem>
//                 <MenuItem value={7}>August</MenuItem>
//                 <MenuItem value={8}>September</MenuItem>
//                 <MenuItem value={9}>October</MenuItem>
//                 <MenuItem value={10}>November</MenuItem>
//                 <MenuItem value={11}>December</MenuItem>
//                 {/* ... (add more months) */}
//               </Select>
//             </FormControl>
//             <FormControl fullWidth variant="outlined" margin="normal">
//               <InputLabel>Filter by Category</InputLabel>
//               <Select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 label="Filter by Category"
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 <MenuItem value="Clothing">Clothing</MenuItem>
//                 <MenuItem value="Food">Food</MenuItem>
//                 <MenuItem value="Gym">Gym</MenuItem>
//                 <MenuItem value="Rental">Rental</MenuItem>
//                 <MenuItem value="Transport">Transport</MenuItem>
//                 <MenuItem value="Groceries">Groceries</MenuItem>
//                 <MenuItem value="Others">Others</MenuItem>
//                 {/* Add more categories here */}
//               </Select>
//             </FormControl>

//             <TextField
//               label="Search"
//               fullWidth
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               variant="outlined"
//               margin="normal"
//             />
//           </div>
//           <Typography
//             variant="body1"
//             sx={{
//               textAlign: "center",
//               fontSize: "28px",
//               background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
//               //   WebkitBackgroundClip: "text",
//               //   WebkitTextFillColor: "transparent",
//             }}
//           >
//             List Of Expenses
//           </Typography>{" "}
//           {fetchedExpenses.length === 0 ? (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 minHeight: "200px",
//               }}
//             >
//               <CircularProgress style={{ color: "#3AC1CC" }} />
//             </div>
//           ) : (
//             <List>
//               {filteredExpenses.map((expense, index) => (
//                 <ListItem
//                   key={index}
//                   sx={{
//                     marginTop: "20px",
//                     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
//                     borderRadius: "10px",
//                     padding: 4,
//                     backgroundColor: "white",
//                   }}
//                 >
//                   <ListItemText
//                     primaryTypographyProps={{ variant: "h5" }}
//                     secondaryTypographyProps={{ variant: "body1" }}
//                     primary={expense.name}
//                     secondary={`Amount: ${
//                       expense.amount
//                     } ${userLocale}\nDescription: ${
//                       expense.description
//                     }\nCategory: ${expense.category}\nDate: ${new Date(
//                       expense.date
//                     ).getDate()}, ${new Intl.DateTimeFormat("en-US", {
//                       month: "long",
//                     }).format(new Date(expense.date))} ${new Date(
//                       expense.date
//                     ).getFullYear()}`}
//                     sx={{ whiteSpace: "pre-line" }}
//                   />
//                   <ListItemSecondaryAction>
//                     <IconButton onClick={() => handleOpenEditDialog(expense)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteExpense(expense._id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </ListItem>
//               ))}
//             </List>
//           )}
//           <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
//             <DialogTitle>Add Expense</DialogTitle>
//             <DialogContent>
//               <TextField
//                 label="Expense Name"
//                 fullWidth
//                 value={expenseName}
//                 onChange={(e) => setExpenseName(e.target.value)}
//                 variant="outlined"
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Expense Amount"
//                 fullWidth
//                 value={expenseAmount}
//                 onChange={handleAmount}
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 type="text"
//                 inputMode="numeric"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       {getCurrencySymbol("AED")}
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <FormControl fullWidth variant="outlined" margin="normal">
//                 <InputLabel>Category</InputLabel>
//                 <Select
//                   value={expenseCategory}
//                   onChange={handleCategoryChange}
//                   label="Category"
//                 >
//                   <MenuItem value="Clothing">Clothing</MenuItem>
//                   <MenuItem value="Food">Food</MenuItem>
//                   <MenuItem value="Gym">Gym</MenuItem>
//                   <MenuItem value="Rental">Rental</MenuItem>
//                   <MenuItem value="Transport">Transport</MenuItem>
//                   <MenuItem value="Groceries">Groceries</MenuItem>
//                   <MenuItem value="Others">Others</MenuItem>
//                   {/* Add more categories here */}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Description"
//                 fullWidth
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 variant="outlined"
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Expense Date"
//                 fullWidth
//                 type="date"
//                 value={expenseDate.toISOString().split("T")[0]}
//                 onChange={handleDateChange}
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   max: new Date().toISOString().split("T")[0],
//                   value: expenseDate.toISOString().split("T")[0],
//                 }}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseAddDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleAddExpense} color="primary">
//                 Add
//               </Button>
//             </DialogActions>
//           </Dialog>
//           <Dialog
//             open={openEditDialog}
//             onClose={handleCloseEditDialog}
//             // maxWidth="xs"
//           >
//             <DialogTitle>Edit Expense</DialogTitle>
//             <DialogContent>
//               <TextField
//                 label="Expense Name"
//                 fullWidth
//                 value={expenseName}
//                 onChange={(e) => setExpenseName(e.target.value)}
//                 variant="outlined"
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Expense Amount"
//                 fullWidth
//                 value={expenseAmount}
//                 onChange={handleAmount}
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 type="text"
//                 inputMode="numeric"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       {getCurrencySymbol("AED")}
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <FormControl fullWidth variant="outlined" margin="normal">
//                 <InputLabel>Category</InputLabel>
//                 <Select
//                   value={expenseCategory}
//                   onChange={handleCategoryChange}
//                   label="Category"
//                 >
//                   <MenuItem value="Clothing">Clothing</MenuItem>
//                   <MenuItem value="Food">Food</MenuItem>
//                   <MenuItem value="Gym">Gym</MenuItem>
//                   <MenuItem value="Rental">Rental</MenuItem>
//                   <MenuItem value="Transport">Transport</MenuItem>
//                   <MenuItem value="Groceries">Groceries</MenuItem>
//                   <MenuItem value="Others">Others</MenuItem>
//                   {/* Add more categories here */}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Description"
//                 fullWidth
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 variant="outlined"
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Expense Date"
//                 fullWidth
//                 type="date"
//                 value={expenseDate.toISOString().split("T")[0]}
//                 onChange={handleDateChange}
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 InputLabelProps={{ shrink: true }}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseEditDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleEditExpense} color="primary">
//                 Save
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Container>
//       </Box>
//       <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
//     </>
//   );
// };

// export default ExpenseManager;
