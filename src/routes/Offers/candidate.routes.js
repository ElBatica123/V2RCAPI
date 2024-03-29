const router = require("express").Router();
const {
  Candidate_Controllers,
} = require("../../controllers/Offers/candidate.controller");
const Candidate = new Candidate_Controllers();

router.get("/", Candidate.Get.bind());
router.get("/:id", Candidate.GetId.bind());
router.post("/", Candidate.Post.bind());
router.put("/:id", Candidate.Put.bind());
router.put("/add/:id", Candidate.AggregateNewCandidate.bind());
router.put("/delete/:id", Candidate.EliminateCandidate.bind());
router.put("/select/:id", Candidate.SelectCandidate.bind());
router.delete("/:id", Candidate.Delete.bind());

module.exports = router;
