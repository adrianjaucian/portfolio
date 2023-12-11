import sys
import random


class Player:
    """Store information of a player."""

    def __init__(self, name):
        """Construct a Player object."""
        self.name = name
        self.games_played = 0
        self.games_won = 0
        self.chip_count = 100

    def bid_chips(self):
        """Prompt the player to enter the number of chips to bid."""
        while True:
            try:
                bid = int(input("Enter the number of chips to bid (1-100): "))
                if bid < 1 or bid > 100:
                    raise ValueError
                return bid
            except ValueError:
                print("Invalid input. Please enter a number between 1 and 100.")


class Die:
    """Class representing a die"""

    def __init__(self, sides, throw=0):
        self.sides = sides
        self.throw = throw

    def dice_roll(self):
        """Simulate a die throw."""
        roll = random.randint(1, self.sides)
        throw = int(input("How hard will you throw? (0-5)\n"))
        result = int(roll + throw)
        if result > 6:
            result = 0 + (result - 6)
        else:
            return result

        # Print picture of dice
        if result == 1:
            print("|-----------------|\n"
                  "|                 |\n"
                  "|        O        |\n"
                  "|                 |\n"
                  "|-----------------|")
        elif result == 2:
            print("|-----------------|\n"
                  "| O               |\n"
                  "|                 |\n"
                  "|               O |\n"
                  "|-----------------|")
        elif result == 3:
            print("|-----------------|\n"
                  "| O               |\n"
                  "|        O        |\n"
                  "|               O |\n"
                  "|-----------------|")
        elif result == 4:
            print("|-----------------|\n"
                  "| O             O |\n"
                  "|                 |\n"
                  "| O             O |\n"
                  "|-----------------|")
        elif result == 5:
            print("|-----------------|\n"
                  "| O             O |\n"
                  "|        O        |\n"
                  "| O             O |\n"
                  "|-----------------|")
        elif result == 6:
            print("|-----------------|\n"
                  "| O             O |\n"
                  "| O             O |\n"
                  "| O             O |\n"
                  "|-----------------|")
        else:
            print("Invalid dice result.")

        return result


class AllThatDice:
    """Start game"""

    players = []

    def __init__(self):
        """Initializes the program to start"""
        pass

    def run(self):
        """Prints a welcome statement and triggers options for the user"""
        print("Welcome to All-That-Dice\n"
              "Developed by Adrian Jaucian\n"
              "COMP1048 Object-Oriented Programming\n"
              "==========================================")

        # While loop to run options and play the game
        # Loop breaks when quit is selected
        while True:
            self.__display_menu()
            if self.option == "q":
                print("Thank you for playing All-That-Dice!")
                break
        else:
            sys.exit("Thank you for playing All-That-Dice!")

    def __display_menu(self):
        """
        Displays the main game menu for the user.
        This will be continuously triggered until the user selects 'q' to quit the program
        """
        print("What would you like to do?")
        self.option = input("(r) Register a player\n"
                            "(s) Show the leaderboard\n"
                            "(p) Play a game\n"
                            "(q) Quit\n")

        # Register player
        if self.option == "r":
            self.register_player()
        # Show player info
        elif self.option == "s":
            self.show_info()
        # Play a game
        elif self.option == "p":
            self.play_game()

    def register_player(self):
        """Register the name of players. Names are then added to the player list.
        If the name already exists, an error is triggered.
        """
        name = input('What is the name of the new player?\n')
        if name in [player.name for player in self.players]:
            print("That name is already taken!")
        else:
            player = Player(name)
            self.players.append(player)
            print("Welcome, ", name)

    def show_info(self):
        """Show player info"""
        print("=============================================\n"
              "Player \t Games Played \t Games Won \t Chips\n"
              "=============================================")
        for player in self.players:
            print(f"{player.name}\t\t{player.games_played}\t\t\t{player.games_won}\t\t\t{player.chip_count}")
        print("=============================================")

    def play_game(self):
        """Send the user to the Game class to select a game to play"""
        game = input("Which game would you like to play?\n"
                     "(o) Odd-or-Even\n"
                     "(m) Maxi\n"
                     "(b) Bunco\n"
                     "(q) Quit to main menu\n")

        if game == "o":
            self.play_odd_or_even()
        elif game == "m":
            self.play_maxi()
        elif game == "b":
            self.play_bunco()
        elif game == "q":
            print("Thank you for playing All-That-Dice!")
        else:
            print("Invalid input. Please select a valid option.")

    def play_odd_or_even(self):
        """Play the Odd or Even game"""
        odd_even = OddEven(self.players)
        odd_even.play()

    def play_maxi(self):
        """Play the Maxi game"""
        maxi = Maxi(self.players)
        maxi.play()

    def play_bunco(self):
        """Play the Bunco game"""
        bunco = Bunco(self.players)
        bunco.play()


class Game:
    """Parent class for all games"""

    def __init__(self, players):
        """Construct a Game object."""
        self.players = players

    def play(self):
        """Placeholder method to be implemented by child classes"""
        pass


class OddEven(Game):
    """Child class for the Odd or Even game"""

    def play(self):
        """Play the Odd or Even game"""
        print("Welcome to Odd or Even game!")
        player_name = input("Enter the player's name: ")

        for player in self.players:
            if player.name == player_name:
                bid = player.bid_chips()
                player.games_played += 1

                guess = input("Guess odd or even: (o/e)\n")
                while guess.lower() != "o" and guess.lower() != "e":
                    guess = input("Invalid guess. Please guess odd or even: (o/e)\n")

                dice = Die(2)
                roll1 = dice.dice_roll()
                roll2 = dice.dice_roll()
                total = roll1 + roll2
                print("Dice roll result:", roll1, "+", roll2, "=", total)
                result = "e" if total % 2 == 0 else "o"
                print("The result is", result)

                if guess.lower() == result:
                    print("Congratulations! You won!")
                    player.chip_count += bid
                    player.games_won += 1
                else:
                    print("Sorry, you lost.")
                    player.chip_count -= bid

                return

        print("Player not found.")


class Maxi(Game):
    """Child class for the Maxi game"""

    def play(self):
        """Play the Maxi game"""
        print("Welcome to Maxi game!")

        # Get the names of the players participating in the game
        player_names = input("Enter the names of the players (comma-separated): ").split(",")
        players = [player for player in self.players if player.name in player_names]

        if len(players) < 2:
            print("Not enough players to play Maxi.")
            return

        bids = {}
        for player in players:
            bid = player.bid_chips()
            bids[player.name] = bid
            player.games_played += 1

        highest_sum = 0
        winners = []

        for player in players:
            dice = Die(2, 0)
            roll1 = dice.dice_roll()
            roll2 = dice.dice_roll()
            total = roll1 + roll2

            print(f"{player.name} rolled {roll1} and {roll2}. Total: {total}")

            if total > highest_sum:
                highest_sum = total
                winners = [player]
            elif total == highest_sum:
                winners.append(player)

        if len(winners) == 0:
            print("No winner!")
        else:
            print("Winner(s):")
            for winner in winners:
                winner.chip_count += sum(bids.values())
                winner.games_won += 1
                print(f"{winner.name} won and gained {sum(bids.values())} chips.")

            for player in players:
                if player not in winners:
                    player.chip_count -= bids[player.name]
                    print(f"{player.name} lost and lost {bids[player.name]} chips.")

    def __get_next_player(self, current_player):
        """Get the next player in the player list"""
        index = self.players.index(current_player)
        if index == len(self.players) - 1:
            return self.players[0]
        else:
            return self.players[index + 1]


class Bunco(Game):
    """Child class for the Bunco game"""

    def play(self):
        """Play the Bunco game"""
        print("Welcome to Bunco game!")

        # Get the names of the players participating in the game
        player_names = input("Enter the names of the players (comma-separated): ").split(",")
        players = [player for player in self.players if player.name in player_names]

        if len(players) < 2:
            print("Insufficient players to play Bunco.")
            return

        round_scores = {player: [0] * 6 for player in players}
        buncos = {player: 0 for player in players}

        for round_num in range(1, 7):
            print(f"\n--- Round {round_num} ---")
            print("Rolling dice...")

            for player in players:
                print(f"It's {player.name}'s turn!")
                dice = Die(6)
                rolls = [dice.dice_roll() for _ in range(3)]

                print(f"{player.name} rolled {rolls}")

                if rolls == [round_num] * 3:
                    print("Bunco! 21 points awarded!")
                    round_scores[player][round_num - 1] = 21
                    buncos[player] += 1
                elif len(set(rolls)) == 1:
                    print("Three of a kind! 5 points awarded!")
                    round_scores[player][round_num - 1] = 5
                else:
                    round_scores[player][round_num - 1] = sum(roll == round_num for roll in rolls)

                if round_scores[player][round_num - 1] > 0:
                    print(f"{player.name} gets to roll again!")

            print("--- End of Round ---")
            print("Scores after round:")
            for player in players:
                print(f"{player.name}: {sum(round_scores[player])} points")
            print()

            # Check if any player has reached 21 points and won the game
            for player in players:
                if sum(round_scores[player]) >= 21:
                    print(f"{player.name} has reached 21 points! They win the game!")
                    self.display_final_scores(players, round_scores)
                    return

        print("Game over. No player reached 21 points.")
        self.display_final_scores(players, round_scores)

    def display_final_scores(self, players, scores):
        """Display the final scores of all players"""
        print("\n--- Final Scores ---")
        for player in players:
            print(f"{player.name}: {sum(scores[player])} points")

        max_score = max(sum(scores[player]) for player in players)
        winners = [player.name for player in players if sum(scores[player]) == max_score]
        if len(winners) == 1:
            print(f"\n{winners[0]} wins the game!")
        else:
            print("\nIt's a tie!")
            print("The winners are:")
            for winner in winners:
                print(winner)


# Test the methods of a game object.
# Create an instance of the AllThatDice class
# test = AllThatDice()

# Test the register_player() method
# test.register_player()  # Register a player with a name
# test.register_player()  # 2x players for maxi
# test.register_player()  # 3x players for bunco

# Test the show_info() method
# test.show_info()  # Display player info

# Test the play_odd_or_even() method
# test.play_odd_or_even()  # Play the Odd or Even game

# Test the play_maxi() method
# test.play_maxi()  # Play the Maxi game

# Test the play_bunco() method
# test.play_bunco()  # Play the Bunco game

# Test the run() method
# test.run()  # Run the game program

# Final Program
my_all_that_dice = AllThatDice()
my_all_that_dice.run()