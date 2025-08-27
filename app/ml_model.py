from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class JobMatcher:
    def __init__(self, jobs):
        self.jobs = jobs
        self.vectorizer = TfidfVectorizer()
        self.job_vectors = self.vectorizer.fit_transform([job['description'] for job in jobs])

    def recommend(self, user_skills, top_n=5, min_score=0.2):
        user_vec = self.vectorizer.transform([user_skills])
        scores = cosine_similarity(user_vec, self.job_vectors).flatten()
        recommended_jobs = sorted(zip(self.jobs, scores), key=lambda x: x[1], reverse=True)
        # filter jobs by minimum similarity score
        recommended_jobs = [(job, score) for job, score in recommended_jobs if score >= min_score]
        return [job for job, score in recommended_jobs[:top_n]]
