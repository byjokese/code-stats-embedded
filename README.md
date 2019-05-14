# code-stats-embeded

> Embed your Code::Stats profile anywhere

Everybody loves stats. So why not to share them where ever you want?

# ☁️ Installation

Add the following code to your html:

```html
<link rel="stylesheet" href="https://cdn.byjokese.com/embeded/codestatsembeded.min.css" />
<script src="https://cdn.byjokese.com/embeded/codestats.min.js"></script>
<script>
  CodeStatsEmbed("ContainerSelector", "username");
</script>
```

# 📝 Documentation

### `CodeStatsEmbed("ContainerSelector", "username");`

Brings the stadistics from Code::Stats (provided username) into your page.

#### Params

- **String|HTMLElement** `container`: The calendar container (query selector or the element itself).
- **String** `username`: The Code::Stats username.

# 💖 Thanks

- Part of the CSS and JS code was taken from the offical project of Code::Stats in GitLab ([https://gitlab.com/code-stats/code-stats](https://gitlab.com/code-stats/code-stats)).
- To _Mikko Ahlroth_ from Code::Stats for creating such great service.

# 📜 License

Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.
