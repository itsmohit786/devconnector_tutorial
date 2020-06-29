const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

// @route   GET     api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {

        // return res.json({ user: req.user.id })

        console.log('USER ID: ' + req.user.id)

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST     api/profile/
// @desc    Add current user's profile
// @access  Private

router.post('/', [auth, [
    check('status', 'Status is required')   //--------------validation Message for status field
        .not()              //-------Validation Rule
        .notEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};

        profileFields.user = req.user.id;

        if (typeof (skills) == 'object') {
            skills_String = JSON.stringify(skills);
        }

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        // Build social object
        profileFields.social = {}

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            // Create
            profile = new Profile(profileFields);

            await profile.save();

            res.json(profile)
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error')
        }

        return res.json({ body: req.body })
    } catch (err) {
        console.log(err)
    }
});


// @route   GET     api/profile/
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// @route   GET     api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        console.log('try')
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        console.log('try me')
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found!' })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found!' })
        }
        res.status(500).send('Server Error')
    }
})


// @route   DELETE     api/profile
// @desc    Delete profile, user, post
// @access  Private


router.delete('/', auth, async (req, res) => {
    try {
        // Remove users posts
        await Post.deleteMany({ user: req.user.id })
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted!' })

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found!' })
        }
        res.status(500).send('Server Error')
    }
})

// @route   PUT     api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [auth,
    [
        check('title', 'Title is required')
            .not()
            .notEmpty(),
        check('company', 'Company is required')
            .not()
            .notEmpty(),
        check('from', 'From date is required')
            .not()
            .notEmpty(),
    ]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }
    })

// @route   PATCH     api/profile/experience/:exp_id
// @desc    Edit profile experience
// @access  Private
router.patch('/experience/:exp_id', [auth,
    [
        check('title', 'Title is required')
            .not()
            .notEmpty(),
        check('company', 'Company is required')
            .not()
            .notEmpty(),
        check('from', 'From date is required')
            .not()
            .notEmpty(),
    ]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const editExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {

            const profile = await Profile.findOne({ user: req.user.id });

            // Get index of experience element to be edit - in the profile experience array
            const editElementIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            if (editElementIndex === -1) {
                return res.status(500).send('Invalid request')
            }

            // update index_element, number of element(s), new value to be updated
            profile.experience.splice(editElementIndex, 1, editExp)

            await profile.save();

            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }
    })

// @route   DELETE     api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index of experience in the profile experience array
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        if (removeIndex === -1) {
            return res.status(500).send('Invalid request')
        }
        // remove index_element, number of element(s)
        profile.experience.splice(removeIndex, 1)

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

// ------------------------------------------------------------------ Education
// @route   PUT     api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [auth,
    [
        check('school', 'School is required')
            .not()
            .notEmpty(),
        check('degree', 'Degree is required')
            .not()
            .notEmpty(),
        check('fieldofstudy', 'Field of study is required')
            .not()
            .notEmpty(),
        check('from', 'From date is required')
            .not()
            .notEmpty(),
    ]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }
    })

// @route   PATCH     api/profile/education/:edu_id
// @desc    Edit profile education
// @access  Private
router.patch('/education/:edu_id', [auth,
    [
        check('school', 'School is required')
            .not()
            .notEmpty(),
        check('degree', 'Degree is required')
            .not()
            .notEmpty(),
        check('fieldofstudy', 'Field of study is required')
            .not()
            .notEmpty(),
        check('from', 'From date is required')
            .not()
            .notEmpty(),
    ]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const editEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {

            const profile = await Profile.findOne({ user: req.user.id });

            // Get index of education element to be edit - in the profile education array
            const editElementIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            if (editElementIndex === -1) {
                return res.status(500).send('Invalid request')
            }

            // update index_element, number of element(s), new value to be updated
            profile.education.splice(editElementIndex, 1, editEdu)

            await profile.save();

            res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }
    })

// @route   DELETE     api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index of education in the profile education array
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        if (removeIndex === -1) {
            return res.status(500).send('Invalid request')
        }
        // remove index_element, number of element(s)
        profile.education.splice(removeIndex, 1)

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})


// @route   GET     api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {

        options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { "User-Agent": "node.js" }
        }

        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
            }

            if (response.statusCode !== 200) {
                res.status(400).json({ msg: 'No GitHub profile found' });
            }

            res.json(JSON.parse(body))
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;