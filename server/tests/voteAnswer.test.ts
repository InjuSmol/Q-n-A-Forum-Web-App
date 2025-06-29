import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import Answer from "../models/answers";

jest.mock("../models/answers", () => ({
    findById: jest.fn(),
}));


let server: Server;

describe("POST /vote/answer/:answerId/comment/:commentId/vote", () => {
    beforeEach(() => {
        server = require("../server");
    });

    afterEach(async () => {
        jest.clearAllMocks();
        server.close();
        await mongoose.disconnect();
    });

    it("should upvote a comment on an answer", async () => {
        const mockComment = { _id: "dummyCommentId", votes: 0 };
        const mockAnswer = { _id: "dummyAnswerId", comments: [mockComment], save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/comment/dummyCommentId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment upvoted successfully");
        expect(mockComment.votes).toBe(1);
    });

    it("should downvote a comment on an answer", async () => {
        const mockComment = { _id: "dummyCommentId", votes: 1 };
        const mockAnswer = { _id: "dummyAnswerId", comments: [mockComment], save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/comment/dummyCommentId/vote")
            .send({ vote: "downvote" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment downvoted successfully");
        expect(mockComment.votes).toBe(0);
    });

    it("should return 404 if the comment does not exist", async () => {
        const mockAnswer = { _id: "dummyAnswerId", comments: [], save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/comment/nonExistentCommentId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Comment not found");
    });

    it("should return 404 if the answer does not exist", async () => {
        (Answer.findById as jest.Mock).mockResolvedValueOnce(null);

        const response = await supertest(server)
            .post("/vote/answer/nonExistentAnswerId/comment/dummyCommentId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Answer not found");
    });

    it("should return 400 if the vote action is invalid", async () => {
        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/comment/dummyCommentId/vote")
            .send({ vote: "invalidVote" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid vote action");
    });

    it("should return 500 if there is a server error", async () => {
        (Answer.findById as jest.Mock).mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/comment/dummyCommentId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Error voting on comment");
    });
});

describe("POST /vote/answer/:answerId/vote", () => {
    beforeEach(() => {
        server = require("../server");
    });

    afterEach(async () => {
        jest.clearAllMocks();
        server.close();
        await mongoose.disconnect();
    });

    it("should upvote an answer", async () => {
        const mockAnswer = { _id: "dummyAnswerId", votes: 0, save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Answer upvoted successfully");
        expect(mockAnswer.votes).toBe(1);
    });

    it("should downvote an answer", async () => {
        const mockAnswer = { _id: "dummyAnswerId", votes: 1, save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/vote")
            .send({ vote: "downvote" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Answer downvoted successfully");
        expect(mockAnswer.votes).toBe(0);
    });

    it("should return 404 if the answer does not exist", async () => {
        (Answer.findById as jest.Mock).mockResolvedValueOnce(null);

        const response = await supertest(server)
            .post("/vote/answer/nonExistentAnswerId/vote")
            .send({ vote: "upvote" });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Answer not found");
    });

    it("should return 400 if the vote action is invalid", async () => {
        const mockAnswer = { _id: "dummyAnswerId", votes: 0, save: jest.fn() };

        (Answer.findById as jest.Mock).mockResolvedValueOnce(mockAnswer);

        const response = await supertest(server)
            .post("/vote/answer/dummyAnswerId/vote")
            .send({ vote: "invalidVote" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid vote action");
    });
});
