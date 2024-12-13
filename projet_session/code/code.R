# Chargement des bibliothèques
library(tidyverse)

# 1. Chargement des données
inequalities <- read_csv("C:/Users/leoth/Bureau/Université/a24/num/projet session/données/OCDE.csv")
expenditures <- read_csv("C:/Users/leoth/Bureau/Université/a24/num/projet session/données/OCDEexpenditure.csv")
unemployment <- read_csv("C:/Users/leoth/Bureau/Université/a24/num/projet session/données/OCDEunemployment.csv")
gdp <- read_csv("C:/Users/leoth/Bureau/Université/a24/num/projet session/données/OCDEgdp.csv")

# 2. Nettoyage des données
## Inequalities
inequalities <- inequalities %>%
  select(REF_AREA, TIME_PERIOD, MEASURE, OBS_VALUE) %>%
  rename(Value_Inequality = OBS_VALUE) %>%
  filter(MEASURE == "PR_INC_DISP", TIME_PERIOD >= 2010)

## Expenditures
expenditures <- expenditures %>%
  select(REF_AREA, TIME_PERIOD, OBS_VALUE) %>%
  rename(Value_Expenditure = OBS_VALUE) %>%
  filter(TIME_PERIOD >= 2010)

## Unemployment
unemployment <- unemployment %>%
  select(REF_AREA, TIME_PERIOD, OBS_VALUE) %>%
  rename(Unemployment = OBS_VALUE) %>%
  filter(TIME_PERIOD >= 2010)

## GDP per capita
gdp <- gdp %>%
  select(REF_AREA, TIME_PERIOD, OBS_VALUE) %>%
  rename(GDP_per_capita = OBS_VALUE) %>%
  filter(TIME_PERIOD >= 2010)

# 3. Fusion des données
combined_data <- inequalities %>%
  left_join(expenditures, by = c("REF_AREA", "TIME_PERIOD")) %>%
  left_join(unemployment, by = c("REF_AREA", "TIME_PERIOD")) %>%
  left_join(gdp, by = c("REF_AREA", "TIME_PERIOD"))

# 4. Gestion des valeurs manquantes
combined_data <- combined_data %>%
  drop_na()

# 5. Vérification des données
summary(combined_data)

# 6. Régression linéaire multiple
model <- lm(Value_Inequality ~ Value_Expenditure + Unemployment + GDP_per_capita, 
            data = combined_data)
summary(model)

# 7. Visualisations
## Relation entre dépenses sociales et inégalités
ggplot(combined_data, aes(x = Value_Expenditure, y = Value_Inequality)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, color = "blue") +
  labs(title = "Relation entre dépenses sociales et inégalités",
       x = "Dépenses sociales (% du PIB)",
       y = "Inégalités (Taux de pauvreté après transferts)")

## Relation entre PIB par habitant et inégalités
ggplot(combined_data, aes(x = GDP_per_capita, y = Value_Inequality)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, color = "green") +
  labs(title = "Relation entre PIB par habitant et inégalités",
       x = "PIB par habitant (USD)",
       y = "Inégalités (Taux de pauvreté après transferts)")

## Relation entre taux de chômage et inégalités
ggplot(combined_data, aes(x = Unemployment, y = Value_Inequality)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, color = "red") +
  labs(title = "Relation entre taux de chômage et inégalités",
       x = "Taux de chômage",
       y = "Inégalités (Taux de pauvreté après transferts)")

# 8. Export des résultats (si nécessaire)
write_csv(combined_data, "C:/Users/leoth/Bureau/Université/a24/num/projet session/données/cleaned_data.csv")
