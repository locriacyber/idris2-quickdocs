# Idris2 Quickdocs

This is an index generator and fast documentation browser for
[Idris2](https://github.com/idris-lang/Idris2).

## Live Demo

A demo of this is hosted at [https://idris2docs.sinyax.net](https://idris2docs.sinyax.net)

## Requirements

To generate the documentation index, you need Python 3,
[poetry](https://python-poetry.org/) and the [`mkdoc` branch of my Idris2
fork](https://github.com/cypheon/Idris2/tree/mkdoc) (at least until the doc
generation is ready to be upstreamed).

## Simple Usage (Build only packages that come with Idris2)

Updating and serving the docs is a bit rought for now, but all the pieces are
available.

Run `poetry install` to install dependencies, then you can run the following:

```sh
IDRIS2_EXECUTABLE=path/to/idris2 IDRIS2_SRC=path/to/idris2/source/code ./rebuild_idris2_bundled_packages.sh
```

The you can serve the current directory (don't do this in production!):

```sh
cd site
yarn
yarn dev
```

## More Complicated Usage (Build docs for more packages)

You can put docs from other packages too.

Pseudo shell code:

```fish
set PACKAGE_DIR path/to/idris2/package
set PACKAGE_NAME package_name

pushd $PACKAGE_DIR
idris2 --mkdoc *.ipkg  ## build docs
set docs $PWD/build/docs
popd
cp -r $docs data/$PACKAGE_NAME  ## copy docs to data
poetry run mkindex.py data
poetry run mkhome.py data
```

Remember to run `poetry install` to install dependencies first!
