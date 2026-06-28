import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: true,
      minlength: 6,
    },
    credits: {
      type:    Number,
      default: 10, // 10 free credits on signup
    },
    plan: {
      type:    String,
      enum:    ["free", "basic", "pro", "enterprise"],
      default: "free",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Hash password before saving to DB
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
