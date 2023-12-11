# Install and load the readxl package
install.packages("readxl")
library(readxl)

# Read the data from the Excel file
embiid_data <- read_xls("/Users/adrianjaucian/Desktop/embiid_23.xls")  

# Display the first few rows to check if the data is loaded correctly
head(embiid_data)

# Load required libraries
install.packages("corrplot")
library(ggplot2)
library(dplyr)
library(corrplot)
library(tidyr)
library(lubridate)

# Histogram of Points per Game
ggplot(embiid_data, aes(x = PTS)) +
  geom_histogram(binwidth = 2, fill = "blue", color = "black") +
  labs(title = "Points per Game Distribution", x = "Points per Game", y = "Frequency")

# Scatter Plot of Minutes Played vs. Points Scored
ggplot(embiid_data, aes(x = MP, y = PTS)) +
  geom_point() +
  labs(title = "Minutes Played vs. Points Scored", x = "Minutes Played", y = "Points Scored")

# Line Chart of Field Goal Attempts Over Time
ggplot(embiid_data, aes(x = as.Date(Date), y = `FGA`)) +
  geom_line(color = "red") +
  labs(title = "Field Goal Attempts Over Time", x = "Date", y = "Field Goal Attempts")

# Bar Chart of Win-Loss Record --> This is whack
# ggplot(embiid_data, aes(x = Opp, fill = ...8)) +
#  geom_bar(position = "dodge") +
#  labs(title = "Win-Loss Record vs. Opponent", x = "Opponent", y = "Games Played") +
#  scale_fill_manual(values = c("W" = "green", "L" = "red"))

# Box Plot of Key Performance Metrics
embiid_data %>%
  select(TRB, AST, PTS) %>%
  gather(key = "Metric", value = "Value") %>%
  ggplot(aes(x = Metric, y = Value)) +
  geom_boxplot(fill = "blue") +
  labs(title = "Box Plot of Key Performance Metrics", x = "Metric", y = "Value")

# Heatmap of Correlation Matrix - this is also whack
correlation_matrix <- cor(embiid_data %>%
                            select(PTS, `FG%`, TRB, AST, STL)) # Add more variables if needed

corrplot(correlation_matrix, method = "color")
