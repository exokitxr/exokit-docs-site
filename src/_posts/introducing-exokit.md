---
title: "Introducing Exokit: A Javascript Web Engine for the Post Screen Era"
date: 2018-03-30
layout: blog
image:
  src: https://raw.githubusercontent.com/exokitxr/exokit/master/icon.png
author: Nicholas Loomis
---

## **The Industry Today**

We have always dreamed of the future as a species, from Back to the Future to the recent Ready Player One, we are a society of dreamers when it comes to imagining what we can create with technology. In order to make that future a reality, we constantly push towards newer, faster, ever improving mediums. Connecting to the internet, and the creativity of web development, have both been things that as of late, have been a bit stabilized in how things are done, with Exokit, we hope to change that.

Exokit is a new JavaScript engine that is built for the post-screen (mixed reality) age, its fast, open source, and made for developers to really unlock parts of online development that haven’t been there before. To quote one of Exokit’s developers, “Javascript (and the browser/engine platform as a whole) has become ubiquitous as both a language and a delivery mechanism for applications. The places where it was previously unthinkable to use JavaScript or a web browser — due to performance or impedance mismatch in programming model, for example — are being fixed with the likes of WASM and platform extensions like workers and off-screen rendering.”

Of course alongside that, we need to mention the big platform goal Exokit is aiming for, which is the virtual, mixed, and augmented reality platforms, with products such as Magic Leap. Until now, web development on these platforms has been restrictive and difficult, with even the top development teams having to come up with hacks all over the place to get their projects working as intended. But as said before, that’s where Exokit comes in, “Integrating with other engines and frameworks is still a nightmare. Nobody’s solved this and everyone’s using hacks. I’m not convinced binary compatibility with native code is truly solvable at the JS layer. The sentiment I hear a lot from people reluctant to use the browser as a platform for games and VR/AR is that the platform is too restrictive. There are things that, for security and compatibility reasons, a traditional browser can’t let sites do. That includes a vast world of graphics features that WebGL/WebXR forbids in the spec, and native integrations that are by definition impossible in a traditional JS sandbox.” As you can see, developer restriction is the problem Exokit will address throughout its own development.

## **The Mission of Exokit**

The mission statement of Exokit and its team is that they are going to empower people to construct their own realities. “We want to empower VR and web developers with AR features today. In particular we’d like to move the ball forward on amazing new APIs provided by the MLSDK, and experiment with native integrations between the web and existing 3D engines like Unreal and Unity (which a lot of developer are clamoring for). And of course we think the world could use a truly hackable, embeddable, post-screen web engine that doesn’t move at a glacial pace (in both performance and features).” As the quote states, along with Magic Leaps release of its SDK (software development kit), a lot can be done in order to move forward with the development of new avenues of connection, web experiences, and real life integration, which is exactly the space Exokit hopes to fill.

## **Exokit’s Main Features/Capabilities**

“By being simple and cutting ties with legacy browser stuff like 2D, it becomes easy to quickly extend and grok. And unlike Chrome which takes a lot to build you can change exokit by editing a .js file.” Exokit is web development, compatible with native code, with no legacy code being dragged behind it, and on top of all of that, its open source. This, as stated earlier, allows web developers to operate more freely, and to convert already made creations to VR/MR/AR more easily than ever before. “We’re basically trying to connect the dots from today to a pervasive AR future. And it starts with seamlessly taking existing content into the framework of the future.”

Something that we haven’t mentioned yet that also brings Exokit up a notch in our eyes is the native code integration with Unity or Unreal as well, done through how Exokit’s sandboxing is tweaked from the normal browser way that we are used to with Chrome or Firefox. “With the world of graphics features that WebGL forbids in the spec, and the native integrations that are by definition impossible in a traditional JS sandbox, things need to change. That’s why Exokit is a node application and can run native code, and it uses a completely different notion of sandboxing (process isolation of the whole browser, like a game on Steam). There’s a full native escape hatch for sites to run and plug into true native code, including plain Unity and Unreal.”

Turning now more towards potential developers wanting to work with Exokit and get creating in Magic leap and VR/AR, we put together a couple lists of things we thought you might want to know:

## **A quick overview of the things Exokit can do:**

Load any http(s) site, Parse a programmatic DOM, Run any `<script>`, Load any `<image>`, `<video>`, `<audio>`, Register and run Web Workers, Render Canvas2D, Render WebGL, Render WebVR, Handle gamepad input, Iframe isolation, Embed anywhere with node, Run tests, and Power a web bot.

## **Things Exokit supports**:

HTTP(S), HTML5, JS, DOM, CanvasRenderingContext2D, Image tag, Audio tag, Video tag, Keyboard events, Mouse events, WebGL, WebVR, Gamepad API, No HTML layouts, and No CSS.

Other things of note: Exokit can’t render HTML, but it can draw Canvas and WebGL/WebXR, natively, and fast. This means you can code robust AR and VR experiences using your favorite flavor of JavaScript, just like you code a website. Under the hood, everything is plain OpenGL, so it plays nice with Windows, Linux, macOS, and Magic Leap. Exokit also builds and runs in Magic Leaps SDK simulator right now, and will work on the hardware’s upcoming release.

## **Current Development**

“I’d say we’re 80% of the way to a public alpha release; it’s mostly just bugs and polish. But having a browser as a footing unlocks an infinite world of tangential business models. From advertising to hosting to custom support and a lot more. I don’t know how far along we are to that because it’s not clear what the truly profitable thing would be. It needs rapid experimentation once the browser part is debugged and shipped.” As per that quote, the current build still needs plenty of “rejiggering” to solidify exactly what we have so far out of Exokit, but it’s looking strong as it comes towards its final stages before alpha 1.0 release!

To quickly touch on future plans and development, some points of note that the developers left us with were that they still would love to help create, “A way to deploy your Magic Leap immersive sites instantly and share them in a hub. Kind of like Github but the sites are live, they have 3d previews, and you can immerse yourself in them immediately in Exokit. I want to help people develop for ML with JS as soon as possible.” Always good to see that the team wants to get more people into their creative platform and the future they see for web development. Be sure to check out our other articles on Exokit and follow on our social media to get in on the development of this next wave of progress towards the future!
