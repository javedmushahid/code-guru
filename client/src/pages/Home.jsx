import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logout from "./switch.png";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Home = ({ handleLogout }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseName, setExpenseName] = useState(
    selectedExpense ? selectedExpense.name : ""
  );
  const [expenseAmount, setExpenseAmount] = useState(
    selectedExpense ? selectedExpense.amount : ""
  );
  const [expenseCategory, setExpenseCategory] = useState(
    selectedExpense ? selectedExpense.category : ""
  );
  const [description, setDescription] = useState(
    selectedExpense ? selectedExpense.description : ""
  );
  const [expenseDate, setExpenseDate] = useState(
    new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000)
  );
  const [userLocale, setUserLocale] = useState("AED");
  const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const [expenses, setExpenses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedReportMonth, setSelectedReportMonth] = useState(
    new Date().getMonth()
  );
  const [selectedReportYear, setSelectedReportYear] = useState(
    new Date().getFullYear()
  );
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportExpenses, setReportExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredExpenses = fetchedExpenses
    .filter((expense) => {
      if (selectedFilter === "all") {
        return true;
      } else {
        const expenseMonth = new Date(expense.date).getMonth();
        return expenseMonth === selectedFilter;
      }
    })
    .filter((expense) => {
      const lowerCaseSearchText = searchText.toLowerCase();
      return (
        expense.name.toLowerCase().includes(lowerCaseSearchText) ||
        expense.description.toLowerCase().includes(lowerCaseSearchText)
      );
    })
    .filter((expense) => {
      if (categoryFilter === "all") {
        return true; // Show all categories
      } else {
        return expense.category === categoryFilter;
      }
    });

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (expense) => {
    setSelectedExpense(expense);
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount);
    setExpenseCategory(expense.category);
    setDescription(expense.description);
    setExpenseDate(new Date(expense.date));
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedExpense(null);
    setExpenseName("");
    setExpenseAmount("");
    setOpenEditDialog(false);
  };

  const handleAddExpense = async () => {
    const newExpense = {
      name: expenseName,
      amount: expenseAmount,
      description: description,
      category: expenseCategory,
      date: expenseDate.toISOString(),
    };
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `https://updated-api-production.up.railway.app/api/v1/add-expenses/${userId}`,
        newExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addedExpense = response.data.data;
      toast.success("Expense added successfully!");
      const updatedExpenses = [...fetchedExpenses, addedExpense];
      setFetchedExpenses(updatedExpenses);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense. Please try again.");
    }
  };

  const handleEditExpense = async () => {
    const updatedExpense = {
      name: expenseName,
      amount: expenseAmount,
      description: description,
      category: expenseCategory,
      date: expenseDate.toISOString(),
    };
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");
    const expenseId = selectedExpense._id;
    try {
      await axios.put(
        `https://updated-api-production.up.railway.app/api/v1/expenses/${expenseId}/${userId}`,
        updatedExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedExpenses = fetchedExpenses.map((expense) =>
        expense._id === expenseId ? { ...expense, ...updatedExpense } : expense
      );

      setFetchedExpenses(updatedExpenses);
      toast.success("Expense updated successfully!");
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error updating expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");

    try {
      const res = await axios.delete(
        `https://updated-api-production.up.railway.app/api/v1/expenses/${expenseId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedExpenses = fetchedExpenses.filter(
        (expense) => expense._id !== expenseId
      );
      toast.success("Expense deleted successfully!");
      setFetchedExpenses(updatedExpenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense. Please try again.");
    }
  };

  const getCurrencySymbol = (currency) => {
    return new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency: currency,
    }).formatToParts(1)[0].value;
  };

  const handleAmount = (event) => {
    const inputPrice = event.target.value;

    const regex = /^\d*\.?\d*$/;

    if (regex.test(inputPrice)) {
      setExpenseAmount(inputPrice);
    }
  };

  const handleCategoryChange = (event) => {
    setExpenseCategory(event.target.value);
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setExpenseDate(selectedDate);
  };

  const fetchExpenses = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `https://updated-api-production.up.railway.app/api/v1/expenses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedExpenses = response.data.expenses;
      //   console.log("Response from fetched expnses",res)
      setFetchedExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user_data");

    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
    }
  }, []);

  const generateMonthlyReport = () => {
    const selectedMonthExpenses = filteredExpenses.filter((expense) => {
      const expenseMonth = new Date(expense.date).getMonth();
      return expenseMonth === selectedReportMonth;
    });

    const total = selectedMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    setReportExpenses(selectedMonthExpenses);
    setTotalExpense(total);
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    const filteredExpenses = fetchedExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === selectedReportMonth &&
        expenseDate.getFullYear() === selectedReportYear
      );
    });

    doc.setFontSize(20);
    doc.text(
      `Monthly Expense Report - ${months[selectedReportMonth]} ${selectedReportYear}`,
      15,
      15
    );

    const tableData = [];
    tableData.push(["Name", "Amount", "Category", "Date"]);
    filteredExpenses.forEach((expense) => {
      tableData.push([
        expense.name,
        `${expense.amount} ${userLocale}`,
        expense.category,
        new Date(expense.date).toLocaleDateString(),
      ]);
    });
    doc.autoTable({
      head: tableData.splice(0, 1),
      body: tableData,
      startY: 30,
    });

    const reportFilename = `expense_report_${months[selectedReportMonth]}_${selectedReportYear}.pdf`;
    doc.save(reportFilename);
  };

  return (
    <>
      <Box bgcolor={"#e8f1ff"}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Expense Manager
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{ marginTop: "30px" }}
            >
              Add Expense
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={generateMonthlyReport}
              sx={{ marginTop: "20px" }}
            >
              Generate Monthly Report
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDFReport}
              sx={{ marginTop: "20px", marginLeft: "20px" }}
            >
              Generate PDF Report
            </Button>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isSmallScreen ? "column" : "row",
              marginBottom: "20px",
              gap: 10,
            }}
          >
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Filter by Month</InputLabel>
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                label="Filter by Month"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={0}>January</MenuItem>
                <MenuItem value={1}>February</MenuItem>
                <MenuItem value={2}>March</MenuItem>
                <MenuItem value={3}>April</MenuItem>
                <MenuItem value={4}>May</MenuItem>
                <MenuItem value={5}>June</MenuItem>
                <MenuItem value={6}>July</MenuItem>
                <MenuItem value={7}>August</MenuItem>
                <MenuItem value={8}>September</MenuItem>
                <MenuItem value={9}>October</MenuItem>
                <MenuItem value={10}>November</MenuItem>
                <MenuItem value={11}>December</MenuItem>
                {/* ... (add more months) */}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filter by Category"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Gym">Gym</MenuItem>
                <MenuItem value="Rental">Rental</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Groceries">Groceries</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="outlined"
              margin="normal"
            />

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Report Month</InputLabel>
              <Select
                value={selectedReportMonth}
                onChange={(e) => setSelectedReportMonth(e.target.value)}
                label="Report Month"
              >
                <MenuItem value={0}>January</MenuItem>
                <MenuItem value={1}>February</MenuItem>
                <MenuItem value={2}>March</MenuItem>
                <MenuItem value={3}>April</MenuItem>
                <MenuItem value={4}>May</MenuItem>
                <MenuItem value={5}>June</MenuItem>
                <MenuItem value={6}>July</MenuItem>
                <MenuItem value={7}>August</MenuItem>
                <MenuItem value={8}>September</MenuItem>
                <MenuItem value={9}>October</MenuItem>
                <MenuItem value={10}>November</MenuItem>
                <MenuItem value={11}>December</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Report Year</InputLabel>
              <Select
                value={selectedReportYear}
                onChange={(e) => setSelectedReportYear(e.target.value)}
                label="Report Year"
              >
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2019}>2019</MenuItem>
                <MenuItem value={2018}>2018</MenuItem>
                <MenuItem value={2017}>2017</MenuItem>
              </Select>
            </FormControl>

            <Dialog open={openReportDialog} onClose={handleCloseReportDialog}>
              <DialogTitle sx={{ fontSize: "24px", fontWeight: 500 }}>
                {`Monthly Report - ${months[selectedReportMonth]} ${selectedReportYear}`}
              </DialogTitle>
              <DialogContent>
                {reportExpenses.map((expense, index) => (
                  <div key={index}>
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ fontSize: "23px", fontWeight: 500 }}
                    >
                      {expense.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "19px", fontWeight: 400 }}
                    >{`Amount: ${expense.amount} ${userLocale}`}</Typography>
                  </div>
                ))}
                <Typography
                  sx={{ marginTop: "20px", fontSize: 20 }}
                  variant="body2"
                  color="secondary"
                >{`Total Expense: ${totalExpense} ${userLocale}`}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseReportDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontSize: "28px",
              background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
            }}
          >
            List Of Expenses
          </Typography>{" "}
          {loadingExpenses ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress style={{ color: "#3AC1CC" }} />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                fontSize: "18px",
                marginTop: "20px",
              }}
            >
              No expenses found.
            </Typography>
          ) : (
            <List>
              {filteredExpenses.map((expense, index) => (
                <ListItem
                  key={index}
                  sx={{
                    marginTop: "20px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px",
                    padding: 4,
                    backgroundColor: "white",
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{ variant: "h5" }}
                    secondaryTypographyProps={{ variant: "body1" }}
                    primary={expense.name}
                    secondary={`Amount: ${
                      expense.amount
                    } ${userLocale}\nDescription: ${
                      expense.description
                    }\nCategory: ${expense.category}\nDate: ${new Date(
                      expense.date
                    ).getDate()}, ${new Intl.DateTimeFormat("en-US", {
                      month: "long",
                    }).format(new Date(expense.date))} ${new Date(
                      expense.date
                    ).getFullYear()}`}
                    sx={{ whiteSpace: "pre-line" }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenEditDialog(expense)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogContent>
              <TextField
                label="Expense Name"
                fullWidth
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                label="Expense Amount"
                fullWidth
                value={expenseAmount}
                onChange={handleAmount}
                variant="outlined"
                margin="normal"
                required
                type="text"
                inputMode="numeric"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {getCurrencySymbol("AED")}
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={expenseCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Gym">Gym</MenuItem>
                  <MenuItem value="Rental">Rental</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Groceries">Groceries</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                label="Expense Date"
                fullWidth
                type="date"
                value={expenseDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                variant="outlined"
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                  value: expenseDate.toISOString().split("T")[0],
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddExpense} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            // maxWidth="xs"
          >
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
              <TextField
                label="Expense Name"
                fullWidth
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                label="Expense Amount"
                fullWidth
                value={expenseAmount}
                onChange={handleAmount}
                variant="outlined"
                margin="normal"
                required
                type="text"
                inputMode="numeric"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {getCurrencySymbol("AED")}
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={expenseCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Gym">Gym</MenuItem>
                  <MenuItem value="Rental">Rental</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Groceries">Groceries</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                label="Expense Date"
                fullWidth
                type="date"
                value={expenseDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                variant="outlined"
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEditExpense} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: isSmallScreen ? 50 : 20,
          right: 10,
        }}
      >
        <Typography
          variant="body1"
          style={{
            marginRight: "15px",
            color: "#333",
            fontSize: "20px",
          }}
        >
          {isSmallScreen ? "" : <span>Hi, {userName}</span>}
        </Typography>
        <Button onClick={handleLogout}>
          {isSmallScreen ? (
            <img
              src={logout}
              style={{ width: "30px", height: "30px" }}
              alt="Logout"
            />
          ) : (
            <span>Logout</span>
          )}
        </Button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
};

export default Home;
