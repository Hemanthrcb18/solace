import os

syllabus = """Machine Learning Basics
Supervised Learning vs Unsupervised Learning
Linear Regression and Gradient Descent
Classification problems and Logistic Regression
Decision Trees and Random Forests
Neural Networks and Deep Learning basics
Model Evaluation, Accuracy, Precision, Recall
Overfitting, Underfitting, and Regularization"""

paragraph_1 = "Welcome to class everyone. Today we are going to dive deep into Machine Learning Basics. We will explore the core differences between Supervised Learning and Unsupervised Learning. In supervised learning, we give the algorithm labeled data. Think of it like a teacher guiding a student. In unsupervised learning, the algorithm tries to find hidden patterns in unlabeled data. Let me draw this on the blackboard to show you the clusters. Notice how these points group together naturally. "

paragraph_2 = "Now, let's talk about predicting values. Linear Regression is our foundational algorithm here. And how does it learn? Through a process called Gradient Descent, which slowly minimizes the error by finding the bottom of the curve. You can see me gesturing to the valley shape here. If we are doing Classification problems instead, we use methods like Logistic Regression to separate classes. "

paragraph_3 = "Moving on, another powerful way to split data is using Decision Trees. They are highly interpretable. But to make them robust, we combine many of them into Random Forests. This prevents the model from relying too heavily on one feature. Let's write the formula on the board quickly. "

paragraph_4 = "Of course, we cannot ignore the human brain's inspiration: Neural Networks. Deep Learning basics rely on layers of nodes passing information forward. If we train our model, we must do Model Evaluation. We look at Accuracy, Precision, and Recall depending on the problem domain. Finally, beware of Overfitting where the model memorizes the data, and Underfitting where it learns nothing. We fix this through Regularization. "

# Generate ~4200 words by multiplying the concepts to simulate a 30-minute deep dive
transcript = " ".join([paragraph_1, paragraph_2, paragraph_3, paragraph_4] * 20) 

os.makedirs('sample_data', exist_ok=True)

with open('sample_data/30_min_syllabus.txt', 'w') as f:
    f.write(syllabus)

with open('sample_data/30_min_transcript.txt', 'w') as f:
    f.write(transcript)

print("Successfully generated 30_min_syllabus.txt and 30_min_transcript.txt in sample_data directory.")
